# cinema/utils.py
from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status

from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from django.contrib.auth.tokens import PasswordResetTokenGenerator



def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_code = 'error'

        if hasattr(exc, 'get_codes'):
            codes = exc.get_codes()
            if isinstance(codes, dict):
                if len(codes) == 1:
                    field, field_codes = next(iter(codes.items()))
                    if isinstance(field_codes, (list, tuple)) and len(field_codes) == 1:
                        error_code = field_codes[0]
                    else:
                        error_code = str(codes)
                else:
                    error_code = str(codes)
            elif isinstance(codes, (list, tuple)) and len(codes) == 1:
                error_code = codes[0]
            else:
                error_code = str(codes)
        elif isinstance(exc, APIException):
            error_code = exc.default_code

        if isinstance(response.data, dict):
            response.data['error_code'] = error_code
        else:
            response.data = {
                'detail': response.data,
                'error_code': error_code
            }

    return response


class EmailConfirmationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp):
        return (
            str(user.pk) + str(timestamp) + str(user.is_active)
        )

email_confirmation_token = EmailConfirmationTokenGenerator()