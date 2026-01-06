pipeline {
    agent any

    environment {
        IMAGE_NAME = "jobpilot-fe"
        CONTAINER_NAME = "jobpilot-fe"
        ENV_CREDENTIAL_ID = "jobpilot-env-frontend-production"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare Environment') {
            steps {
                script {
                    withCredentials([file(credentialsId: ENV_CREDENTIAL_ID, variable: 'MY_ENV_FILE')]) {
                        sh 'cp $MY_ENV_FILE .env.production'
                    }
                }
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                script {
                    sh """
                        # Stop và remove container cũ
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        
                        # Remove image cũ (QUAN TRỌNG!)
                        docker rmi ${IMAGE_NAME}:latest || true
                    """
                }
            }
        }

        stage('Build New Image') {
            steps {
                sh """
                    docker build --no-cache \
                        -f Dockerfile.production \
                        -t ${IMAGE_NAME}:latest \
                        --build-arg NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCCX4A1LA0seSgsjv8J3NbPOGgXIhoKTOg \
                        --build-arg NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=jobpilot-432f1.firebaseapp.com \
                        --build-arg NEXT_PUBLIC_FIREBASE_PROJECT_ID=jobpilot-432f1 \
                        --build-arg NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=jobpilot-432f1.firebasestorage.app \
                        --build-arg NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=605788664856 \
                        --build-arg NEXT_PUBLIC_FIREBASE_APP_ID=1:605788664856:web:2d1a741c7ce30d65963f6d \
                        .
                """
            }
        }

        stage('Start New Container') {
            steps {
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        -p 3000:3000 \
                        --restart unless-stopped \
                        --env-file .env.production \
                        ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                script {
                    sh """
                        # Đợi container khởi động
                        sleep 5
                        
                        # Kiểm tra container đang chạy
                        docker ps | grep ${CONTAINER_NAME}
                        
                        # Kiểm tra logs
                        docker logs ${CONTAINER_NAME} --tail 20
                        
                        # Test health check (optional)
                        # curl -f http://localhost:3000 || exit 1
                    """
                }
            }
        }
    }
    
    post {
        always {
            sh 'rm -f .env.production'
        }
        success {
            echo "✅ Deployment successful!"
            sh 'docker ps -a | grep ${CONTAINER_NAME}'
        }
        failure {
            echo "❌ Deployment failed!"
            sh 'docker logs ${CONTAINER_NAME} --tail 50 || true'
        }
    }
}