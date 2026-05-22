pipeline {
    agent any

    tools {
        nodejs "node20"
    }

    environment {
        IMAGE_NAME = "myapp"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git 'https://github.com/Chitraksh09error/DevsecOps-CI-CD.git'
            }
        }

        stage('SonarQube Scan') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=myapp \
                        -Dsonar.sources=src \
                        -Dsonar.host.url=http://host.docker.internal:9000 \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
            }
        }

        stage('Dependency Scan') {
            steps {
                sh 'trivy fs . > dependency-report.txt || true'
            }
        }

        stage('Secret Scan') {
            steps {
                sh 'trivy fs --scanners secret . > secret-report.txt || true'
            }
        }

        stage('IaC Scan') {
            steps {
                sh 'checkov -d . > checkov-report.txt || true'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Container Scan') {
            steps {
                sh 'trivy image $IMAGE_NAME > container-report.txt || true'
            }
        }

        stage('Policy Gate') {
            steps {
                sh '''
                    if grep -q CRITICAL container-report.txt; then
                        echo "Critical vulnerabilities found"
                        exit 1
                    fi
                '''
            }
        }

        stage('Deploy to Dev') {
            steps {
                sh 'kubectl apply -f kubernetes/dev/deployment.yaml'
            }
        }

        stage('Approval for Staging') {
            steps {
                input 'Deploy to staging?'
            }
        }

        stage('Deploy to Staging') {
            steps {
                sh 'kubectl apply -f kubernetes/staging/deployment.yaml'
            }
        }

        stage('Approval for Production') {
            steps {
                input 'Deploy to production?'
            }
        }

        stage('Deploy to Production') {
            steps {
                sh 'kubectl apply -f kubernetes/prod/deployment.yaml'
            }
        }
    }
}