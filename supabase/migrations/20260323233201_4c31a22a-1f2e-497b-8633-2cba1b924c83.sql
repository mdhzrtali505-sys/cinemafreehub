UPDATE ad_settings SET ad_key = '', ad_type = 'responsive' WHERE ad_type = 'banner';
UPDATE ad_settings SET ad_key = '', is_enabled = false WHERE ad_type = 'popunder';
UPDATE ad_settings SET ad_key = '' WHERE ad_type = 'reward';