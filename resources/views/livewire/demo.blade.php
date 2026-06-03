<div class="lr">
    <div class="lr-container">
        <h4>{{ __('demo.h4') }}</h4>
        <div class="lr-inp-item">
            <div class="helper-text-all">
                <h6>{{ __('demo.name') }}<span>*</span></h6>
            </div>
            <label><input class="name-input" type="text" name="name" id="1" wire:model="name" ></label>
            <span class="helper-text" id="name-helper">{{ __('demo.name_span') }}</span>

        </div>
        <div class="lr-inp-item">
            <div class="helper-text-all">
                <h6>{{ __('demo.email') }}<span>*</span></h6>
            </div>
            <label><input class="email-input" type="email" name="email" autocomplete="email" wire:model="email" ></label>
            <span class="helper-text" id="email-helper">{{ __('demo.email_span') }}</span>


        </div>
        <div class="lr-inp-item">
            <div class="helper-text-all">
                <h6>{{ __('demo.phone') }}<span>*</span></h6>
            </div>
            <label><input id="phone" class="phone-input" type="text" name="phone"  wire:model="phone" ></label>
            <span class="helper-text" id="phone-helper">{{ __('demo.phone_span') }}</span>

        </div>
            <div class="fields-required">
                <p>* {{ __('demo.p') }}</p>
            </div>


        <h6>{{ __('demo.h6') }}</h6>
        <div class="lr-mes">
            <div class="lr-mes-item">
                <input type="radio" id="call-number" name="contact-method" value="call"  wire:model="source">
                <label for="call-number"><h5>{{ __('demo.h5') }}</h5></label>
            </div>

            <div class="lr-mes-item">
                <input type="radio" id="viber-messenger" name="contact-method" value="viber" wire:model="source">
                <label for="viber-messenger"><h5>{{ __('demo.h5_2') }}</h5></label>
            </div>
            <div class="lr-mes-item">
                <input type="radio" id="telegram-messenger" name="contact-method" value="telegram" wire:model="source">
                <label for="telegram-messenger"><h5>{{ __('demo.h5_3') }}</h5></label>
            </div>
            <div class="lr-mes-item">
                <input type="radio" id="whatsapp-messenger" name="contact-method" value="whatsapp" wire:model="source">
                <label for="whatsapp-messenger"><h5>{{ __('demo.h5_4') }}</h5></label>
            </div>
        </div>
        <div class="horizontal-stripe"></div>

        <div class="lr-footer">
            <h5>{{ __('demo.h5_5') }}<br>
                <a href="">{{ __('nav.Privacy_policies') }}</a>
            </h5>
        </div>
        <div class="btn btn-container btn-submit" wire:click="send">{{ __('demo.btn') }}</div>
    </div>
</div>
