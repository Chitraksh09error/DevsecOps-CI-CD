    pipeline {
        agent any

        tools {
            nodejs "node20"
            sonarScanner 'sonar-scanner'
        }

        environment {
            IMAGE_NAME = "myapp"
            SONAR_HOST = "http://host.docker.internal:9000"
        }

        stages {

            stage('Checkout Code') {
                steps {
                    git url: 'https://github.com/Chitraksh09error/DevsecOps-CI-CD.git', branch: 'main'
                }
            }

            stage('Node Setup') {
                steps {
                    sh '''
                        node -v
                        npm -v
                        npm install
                    '''
                }
            }

        stage('SonarQube Scan') {
    steps {
        withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
            script {
                def scannerHome = tool 'sonar-scanner'

                sh """
                ${scannerHome}/bin/sonar-scanner \
                -Dsonar.projectKey=socialsapp \
                -Dsonar.sources=. \
                -Dsonar.host.url=http://host.docker.internal:9000 \
                -Dsonar.login=$SONAR_TOKEN
                """
            }
        }
    }
}

            stage('Dependency Scan (Trivy FS)') {
                steps {
                    sh '''
                        trivy fs . > dependency-report.txt || true
                    '''
                }
            }

            stage('Secret Scan') {
                steps {
                    sh '''
                        trivy fs --scanners secret . > secret-report.txt || true
                    '''
                }
            }

            stage('IaC Scan (Checkov)') {
                steps {
                    sh '''
                        checkov -d . > checkov-report.txt || true
                    '''
                }
            }

            stage('Docker Build') {
                steps {
                    sh '''
                        docker build -t $IMAGE_NAME:latest .
                    '''
                }
            }

            stage('Container Scan (Trivy Image)') {
                steps {
                    sh '''
                        trivy image $IMAGE_NAME:latest > container-report.txt || true
                    '''
                }
            }

            stage('Policy Gate') {
                steps {
                    sh '''
                        echo "Checking for CRITICAL vulnerabilities..."
                        if grep -q "CRITICAL" container-report.txt; then
                            echo "❌ CRITICAL vulnerabilities found"
                            exit 1
                        else
                            echo "✅ No critical issues found"
                        fi
                    '''
                }
            }

            stage('Deploy to Dev') {
                steps {
                    sh '''
                        kubectl apply -f kubernetes/dev/deployment.yaml
                    '''
                }
            }

            stage('Approval for Staging') {
                steps {
                    input message: 'Deploy to staging?'
                }
            }

            stage('Deploy to Staging') {
                steps {
                    sh '''
                        kubectl apply -f kubernetes/staging/deployment.yaml
                    '''
                }
            }

            stage('Approval for Production') {
                steps {
                    input message: 'Deploy to production?'
                }
            }

            stage('Deploy to Production') {
                steps {
                    sh '''
                        kubectl apply -f kubernetes/prod/deployment.yaml
                    '''
                }
            }
        }

        post {
            success {
                echo "✅ Pipeline SUCCESS"
            }

            failure {
                echo "❌ Pipeline FAILED — check logs"
            }

            always {
                echo "Pipeline completed"
            }
        }
    }