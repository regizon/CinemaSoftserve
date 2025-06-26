BACKEND

python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py createsuperuser

python manage.py runserver

FRONTEND

(! node.js 22.17.0(LTS)+ required !)

npm run dev
