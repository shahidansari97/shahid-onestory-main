<div class="container" id="contacts">
    <div class="feedback">
        <div class="feedback-desc">
            <div class="feedback-desc-title">
                <h2>{{ __('home.additional-questions.feedback-desc-title.h2') }} <span>{{ __('home.additional-questions.feedback-desc-title.span') }}</span> {{ __('home.additional-questions.feedback-desc-title.h2_2') }}</h2>
            </div>
            <div class="feedback-desc-content">
                <h6>{{ __('home.additional-questions.feedback-desc-content.h6') }}</h6>
                <div class="feedback-item">
                    <span>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="4" fill="#F3F3F1"/>
                            <path d="M20.5034 4H11.4966C10.2539 4 9.24661 5.00725 9.24661 6.25V25.75C9.24661 26.9928 10.2539 28 11.4966 28H20.5034C21.7461 28 22.7534 26.9928 22.7534 25.75V6.25C22.7534 5.00725 21.7461 4 20.5034 4ZM21.2534 25.75C21.2534 26.164 20.9174 26.5 20.5034 26.5H11.4966C11.0826 26.5 10.7466 26.164 10.7466 25.75V6.25C10.7466 5.836 11.0826 5.5 11.4966 5.5H20.5034C20.9174 5.5 21.2534 5.836 21.2534 6.25V25.75ZM16.0011 22.7541C15.1742 22.7541 14.5049 23.4242 14.5049 24.25C14.5049 25.0758 15.1746 25.7463 16.0011 25.7463C16.828 25.7463 17.4974 25.0758 17.4974 24.25C17.4974 23.4242 16.828 22.7541 16.0011 22.7541ZM17.5011 6.25H14.5011C14.0871 6.25 13.7511 6.586 13.7511 7C13.7511 7.414 14.0871 7.75 14.5011 7.75H17.5011C17.9151 7.75 18.2511 7.414 18.2511 7C18.2511 6.586 17.9151 6.25 17.5011 6.25Z"
                                  fill="#219EBC"/>
                        </svg>

                    </span>
                    <p>{{ config('app.contact.phone') }}</p>
                </div>
                <div class="feedback-item">
                    <span>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="4" fill="#F3F3F1"/>
                            <path d="M11 13L16 16.5L21 13" stroke="#219EBC" stroke-width="1.5" stroke-linecap="round"
                                  stroke-linejoin="round"/>
                            <path d="M6 21V11C6 10.4696 6.21071 9.96086 6.58579 9.58579C6.96086 9.21071 7.46957 9 8 9H24C24.5304 9 25.0391 9.21071 25.4142 9.58579C25.7893 9.96086 26 10.4696 26 11V21C26 21.5304 25.7893 22.0391 25.4142 22.4142C25.0391 22.7893 24.5304 23 24 23H8C7.46957 23 6.96086 22.7893 6.58579 22.4142C6.21071 22.0391 6 21.5304 6 21Z"
                                  stroke="#219EBC" stroke-width="1.5"/>
                        </svg>
                    </span>
                    <p>{{ config('app.contact.email') }}</p>
                </div>
                <div class="feedback-item">
                    <span>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="32" height="32" rx="4" fill="#F3F3F1"/>
                            <path d="M22.91 22C23.825 23.368 24.211 24.203 23.887 24.9C23.847 24.9853 23.8003 25.0677 23.747 25.147C23.172 26 21.687 26 18.717 26H13.283C10.313 26 8.82901 26 8.25401 25.147C8.20155 25.0681 8.15476 24.9855 8.11401 24.9C7.79001 24.203 8.17601 23.368 9.09001 22M19 13.5C19 14.2956 18.6839 15.0587 18.1213 15.6213C17.5587 16.1839 16.7957 16.5 16 16.5C15.2044 16.5 14.4413 16.1839 13.8787 15.6213C13.3161 15.0587 13 14.2956 13 13.5C13 12.7044 13.3161 11.9413 13.8787 11.3787C14.4413 10.8161 15.2044 10.5 16 10.5C16.7957 10.5 17.5587 10.8161 18.1213 11.3787C18.6839 11.9413 19 12.7044 19 13.5Z"
                                  stroke="#219EBC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 6C20.059 6 23.5 9.428 23.5 13.587C23.5 17.812 20.003 20.777 16.773 22.793C16.5378 22.9283 16.2713 22.9995 16 22.9995C15.7287 22.9995 15.4622 22.9283 15.227 22.793C12.003 20.757 8.5 17.827 8.5 13.587C8.5 9.428 11.941 6 16 6Z"
                                  stroke="#219EBC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                    <p>{{ __('home.additional-questions.feedback-desc-content.feedback-item.p1') }} <br>{{ __('home.additional-questions.feedback-desc-content.feedback-item.p1_2') }}</p>
                </div>
                <div class="feedback-item">
                    <p>{{ __('home.additional-questions.feedback-desc-content.feedback-item.p2') }}</p>
                </div>
            </div>

        </div>
        <div class="feedback-form">
            <h4>{{ __('home.additional-questions.feedback-form.h4') }}</h4>
            <div class="lr-inp-item">
                <label><input class="name-input" type="text" wire:model="name" id="1" placeholder="{{ __('home.additional-questions.feedback-form.lr-inp-item.name_p') }}"></label>
                <span class="helper-text" id="name-helper">{{ __('home.additional-questions.feedback-form.lr-inp-item.name') }}</span>
            </div>
            <div class="lr-inp-item">
                <label><input class="email-input" type="email" wire:model="email" autocomplete="email" placeholder="{{ __('home.additional-questions.feedback-form.lr-inp-item.email_p') }}"></label>
                <span class="helper-text" id="email-helper">{{ __('home.additional-questions.feedback-form.lr-inp-item.email') }}</span>
            </div>
            <div class="lr-inp-item">
                <label><input id="phone" class="phone-input" type="text" wire:model="phone"
                              placeholder="{{ __('home.additional-questions.feedback-form.lr-inp-item.phone_p') }}"></label>
                <span class="helper-text" id="phone-helper">{{ __('home.additional-questions.feedback-form.lr-inp-item.phone') }}</span>
            </div>

            <textarea cols="62" rows="8" wire:model="message" placeholder="{{ __('home.additional-questions.feedback-form.lr-inp-item.message_p') }}"></textarea>
            <p>{{ __('home.additional-questions.feedback-form.lr-inp-item.message') }}
                <span><a href="/#">{{ __('home.additional-questions.feedback-form.lr-inp-item.message_a') }}</a></span>
            </p>
            <div class="btn btn-container btn-submit" wire:click="send">
                {{ __('home.additional-questions.feedback-form.lr-inp-item.btn') }}
            </div>
        </div>
    </div>
</div>
