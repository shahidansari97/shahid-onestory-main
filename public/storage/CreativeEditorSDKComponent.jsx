import CreativeEditorSDK from '@cesdk/cesdk-js'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import '../../../css/video-player.css'

export default function CreativeEditorSDKComponent({ onVideoUpload }) {
    const cesdk_container = useRef(null)
    const [cesdk, setCesdk] = useState(null)
    const [exportMessage, setExportMessage] = useState("Exporting video...")
    const [isExporting, setIsExporting] = useState(false)
    const onVideoUploadRef = useRef(onVideoUpload)

    useEffect(() => {
        onVideoUploadRef.current = onVideoUpload
    }, [onVideoUpload])

    const config = {
        license: import.meta.env.VITE_CESDK_LICENSE,
        userId: import.meta.env.VITE_CESDK_USER_ID,
        baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.36.1/assets',
        ui: {
            scale: 'large',
            elements: {
                view: 'default',
                panels: {
                    settings: true
                },
                navigation: {
                    position: 'top',
                    action: {
                        load: true,
                        import: true,
                        download: true,
                        export: true
                    }
                },
                appearance: {
                    theme: {
                        backgroundColor: '#282828',
                        accentColor: '#CBCFFF',
                        activeColor: '#BFC2E9'
                    }
                }
            }
        },
        callbacks: {
            onUpload: 'local',
            onLoad: async (files) => {
                if (!cesdk) return
                if (!files || files.length === 0) {
                    console.error('No file selected in onLoad callback')
                    return
                }
                const file = files[0]
                const content = await file.text()
                console.log('Loaded file content:', content)
                if (!content) {
                    console.error('File is empty or could not be read')
                    return
                }
                try {
                    await cesdk.load(JSON.parse(content))
                } catch (error) {
                    console.error('Error parsing or loading scene:', error)
                }
            },
            onExport: async (blobs, options) => {
                setExportMessage("Exporting video...")
                setIsExporting(true)
                const videoBlob = blobs[0]
                const formData = new FormData()
                formData.append('file', videoBlob, `cesdk-${new Date().toISOString()}.mp4`)
                formData.append('allowed_types', 'video')
                try {
                    const response = await axios.post('/upload', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    if (response.status === 200) {
                        const videoData = {
                            videoName: response.data.fileName,
                            videoUrl: response.data.url
                        }
                        setExportMessage("Video exported successfully!")
                        if (onVideoUploadRef.current) {
                            onVideoUploadRef.current(videoData)
                        }
                        const targetElement = document.querySelector('.os-form--create-stories')
                        if (targetElement) {
                            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }
                    } else {
                        setExportMessage("Failed to upload video.")
                    }
                } catch (error) {
                    setExportMessage("Error uploading video.")
                }
                setTimeout(() => setIsExporting(false), 5000)
                return Promise.resolve()
            },
            onImport: async () => {
                if (!cesdk) return
                try {
                    const response = await fetch('https://onestoryplanet.com/storage/cesdk_export.scene')
                    const content = await response.text()
                    await cesdk.load(JSON.parse(content))
                } catch (error) {
                    console.error('Error importing remote scene:', error)
                }
            },
            onDownload: async (data, { extension = 'scene', mimeType = 'application/json' } = {}) => {
                if (!data) return
                let blob
                if (data instanceof Blob) {
                    blob = data
                } else if (typeof data === 'object') {
                    const jsonString = JSON.stringify(data, null, 2)
                    blob = new Blob([jsonString], { type: mimeType })
                } else if (typeof data === 'string') {
                    blob = new Blob([data], { type: mimeType })
                } else {
                    return
                }
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `cesdk_export.${extension}`
                link.click()
                URL.revokeObjectURL(url)
            }
        }
    }

    useEffect(() => {
        if (!cesdk_container.current) return
        let cleanedUp = false
        let instance
        CreativeEditorSDK.create(cesdk_container.current, config).then(async (_instance) => {
            instance = _instance
            if (cleanedUp) {
                instance.dispose()
                return
            }
            await Promise.all([
                instance.addDefaultAssetSources(),
                instance.addDemoAssetSources({ sceneMode: 'Video' })
            ])
            instance.ui.setBackgroundTrackAssetLibraryEntries(['ly.img.image', 'ly.img.video'])
            const width = 1920
            const height = 1080
            const unit = 'Pixel'
            await instance.createVideoScene({ width, height, unit })
            setCesdk(instance)
        })
        const cleanup = () => {
            cleanedUp = true
            instance?.dispose()
            setCesdk(null)
        }
        return cleanup
    }, [cesdk_container])

    return (
        <>
            <div
                ref={cesdk_container}
                style={{ width: '100vw', height: '95vh' }}
                className='os-profile__video-editor'
            />
            {isExporting && (
                <div className='os-message os-message--success os-message--video-export'>
                    {exportMessage}
                </div>
            )}
        </>
    )
}
