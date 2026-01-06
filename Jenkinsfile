pipeline {
    agent any

    environment {
        IMAGE_NAME = "jobpilot-fe"
        // ID của secret file bạn đã tạo trong Jenkins
        ENV_CREDENTIAL_ID = "jobpilot-env-frontend-production" 
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // 🔥 BƯỚC MỚI: Lấy file .env từ Jenkins ném vào workspace
        stage('Prepare Environment') {
            steps {
                script {
                    // Lấy file secret ra biến tạm 'MY_ENV_FILE'
                    withCredentials([file(credentialsId: ENV_CREDENTIAL_ID, variable: 'MY_ENV_FILE')]) {
                        // Copy và đổi tên thành .env.production để Dockerfile nhìn thấy
                        sh 'cp $MY_ENV_FILE .env.production'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                // Lúc này trong thư mục đã có .env.production
                // Dockerfile sẽ COPY nó vào image -> Build thành công
                sh 'docker build --no-cache -f Dockerfile.production -t $IMAGE_NAME:latest .'
            }
        }

        stage('Deploy') {
            steps {
                // Restart container bằng Docker Compose
                sh '''
                docker compose -f docker-compose.production.yml down || true
                docker compose -f docker-compose.production.yml up -d
                '''
            }
        }
    }
    
    // Dọn dẹp file .env sau khi build xong để bảo mật (Optional)
    post {
        always {
            sh 'rm -f .env.production'
        }
    }
}