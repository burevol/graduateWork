import urllib.request
import urllib.parse
import environ


def send_sms(to, text):
    env = environ.Env()
    environ.Env.read_env()
    api_key = env('SMS_API_KEY')
    encoded_text = urllib.parse.quote_plus(text)
    with urllib.request.urlopen(f'https://sms.ru/sms/send?api_id={api_key}&to={to}&msg={encoded_text}&json=1') as response:
        body = response.read()
    print(body.decode())
