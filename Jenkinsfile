pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-south-1'
        AWS_ACCOUNT_ID = '368460662487'
        NODE_ENV = 'development'
        JENKINS_USER = 'Jenkins-user'
        ECR_FRONTEND = 'ecr_frontend'
        ECR_BACKEND = 'ecr_backend'
        DB_USERNAME = 'postgres'
        DB_PASSWORD = "${env.AWS_DB_PASSWORD}"
        DB_HOST = "${env.AWS_DB_URL}"
        DB_NAME = "${env.AWS_DB_NAME}"
        AWS_EB_APP_NAME = "GM-Impianti"
        AWS_EB_ENVIRONMENT = "Gmimpianti-env"
        }

    stages {
 
        stage('Pre-Build') {
          steps {
            sh "aws configure set region ${AWS_REGION}"
          }
        }

        stage('Build games docker image') {
            steps {
                dir('frontend') {
                    script {
                        docker.withRegistry(
                        "https://${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com",
                        "ecr:${AWS_REGION}:${JENKINS_USER}"
                        ) {
                        docker.build("${ECR_FRONTEND}:latest")
                        }
                    }
                }
            }
        }

        stage('Build rng docker image') {
            steps {
                dir('backend') {
                    script {
                        docker.withRegistry(
                        "https://${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com",
                        "ecr:${AWS_REGION}:${JENKINS_USER}"
                        ) {
                        docker.build("${ECR_BACKEND}:latest")
                        }
                    }
                }
            }
        }

        stage("Push games image to ecr") {
            steps {
                script {
                    docker.withRegistry(
                        "https://${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com",
                        "ecr:${AWS_REGION}:${JENKINS_USER}"
                        ) {
                        docker.image("${ECR_FRONTEND}:latest").push()
                    }
                }
            }
        }

        stage("Push rng image to ecr") {
            steps {
                script {
                    docker.withRegistry(
                        "https://${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com",
                        "ecr:${AWS_REGION}:${JENKINS_USER}"
                        ) {
                        docker.image("${ECR_BACKEND}:latest").push()
                    }
                }
            }
        }

        stage("Push games image to ebs") {
            steps {
                script {
                    sh "aws elasticbeanstalk update-environment --application-name ${AWS_EB_APP_NAME} --environment-name ${AWS_EB_ENVIRONMENT} --version-label ${AWS_EB_ENVIRONMENT}"
                }
            }
        }
    }
}