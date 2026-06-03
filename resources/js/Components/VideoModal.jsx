import React from "react";
import { Modal, Box, IconButton } from "@mui/material";
import CloseIcon from './../../../img/close.svg';
import gift from './../../../img/icons/gift.svg';
import contactsvg from './../../../img/icons/contact.svg';
import HlsPlayer from "../HlsPlayer";

export default function VideoModal({ 
    open, 
    onClose, 
    item, 
    onOpenGiftModal 
}) {
    console.log('🎬 VideoModal props:', { open, item: item?.id, onClose: !!onClose, onOpenGiftModal: !!onOpenGiftModal });
    
    const modalStyles = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: "900px", // Increased max-width for video
        bgcolor: "background.paper",
        borderRadius: "10px",
        boxShadow: 24,
        p: 3,
        outline: 'none',
    };

    const handleGiftClick = () => {
        onOpenGiftModal(item, "gift", item.author);
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            className="video-modal"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999
            }}
        >
            <Box sx={modalStyles}>
                <div className="video-modal-content">
                    {/* Debug info */}
                    <div style={{ position: 'absolute', top: 10, left: 10, background: 'red', color: 'white', padding: '5px', zIndex: 10000 }}>
                        Video Modal Open: {open ? 'YES' : 'NO'}
                    </div>
                    {/* Close Button */}
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            zIndex: 1000,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0,0,0,0.7)',
                            }
                        }}
                    >
                        <img src={CloseIcon} style={{ width: '24px', height: '24px' }} alt="Close" />
                    </IconButton>
                    
                    <div className="os-video__player" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="os-video__panel">
                            <HlsPlayer
                                src={item.master_url || item.src || item.video_url}
                                poster={item.thumbnail}
                                classes={`os-video__iframe os-video__iframe--full`}
                                autoPlay={true}
                                controls={true}
                            />
                        </div>
                        <div className='videoprofile' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <div className="os-video__storyteller-content" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <img src={item?.author?.avatar} alt="Profile" className="os-video__storytellr-photo" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                                <div className="os-video__storyteller-info">
                                    <div className="os-video__storyteller-name" style={{ fontWeight: 'bold' }}>{item?.author?.name}</div>
                                    <div className="os-video__storyteller-desc" style={{ fontSize: '0.9em', color: '#555' }}>
                                        <b>{item?.author?.worldMessage}</b>
                                    </div>
                                    <div className="os-video__storyteller-desc" style={{ fontSize: '0.9em', color: '#555' }}>{item?.author?.story}</div>
                                </div>
                            </div>
                            <div className="os-video__storyteller-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <a className="os-btn os-btn--fw-bold os-btn--outline os-btn--gap-16 os-btn--p-s os-btn--with-icon" href={`/chatify/${item?.author?.id}`} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '5px', border: '1px solid #ccc', textDecoration: 'none', color: '#333' }}>
                                    <img src={contactsvg} alt="" className="os-btn__icon os-btn__icon--w-24" width="24" height="24" style={{ marginRight: '8px' }} />Connect Storyteller
                                </a>
                                <button onClick={handleGiftClick} className="os-btn os-btn--fw-bold os-btn--fs-lg os-btn--primary os-btn--gap-16 os-btn--p-s os-btn--with-icon os-btn--w-full-mob" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderRadius: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                                    <img src={gift} alt="" className="os-btn__icon os-btn__icon--w-24" width="24" height="24" style={{ marginRight: '8px' }} />Gift the Creator
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
}

