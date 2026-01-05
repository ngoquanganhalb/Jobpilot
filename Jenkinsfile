pipeline {
    agent any

    environment {
        IMAGE_NAME = "jobpilot-fe"
        CONTAINER_NAME = "jobpilot-fe"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -f Dockerfile.production -t $IMAGE_NAME:latest .
                '''
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                docker rm -f $CONTAINER_NAME || true
                docker compose -f docker-compose.production.yml up -d
                '''
            }
        }
    }
}
