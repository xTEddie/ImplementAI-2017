ENVIRONMENT = 'dev'
# ENVIRONMENT = 'prod'

SETTINGS_MODULE = 'backend.config.settings.dev'

if ENVIRONMENT == 'prod':
    SETTINGS_MODULE = 'backend.config.settings.prod'
