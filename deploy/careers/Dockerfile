FROM python:3.12-slim
WORKDIR /app
COPY careers_backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt && useradd --uid 10001 --create-home careers && mkdir -p /var/lib/waikwan-careers && chown careers:careers /var/lib/waikwan-careers
COPY careers_backend/__init__.py careers_backend/app.py careers_backend/questionnaire.py careers_backend/scoring.py careers_backend/validation.py careers_backend/reporting.py /app/careers_backend/
ENV CAREERS_DB_PATH=/var/lib/waikwan-careers/receipts.sqlite3
USER careers
EXPOSE 8000
CMD ["sh", "-c", "exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 1 --threads 4 --timeout 90 careers_backend.app:application"]
