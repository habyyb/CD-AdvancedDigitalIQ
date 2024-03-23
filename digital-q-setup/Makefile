# Makefile for the Digital-Q setup

.PHONY: all

deploy:
	cdk deploy --all --require-approval never

destroy:
	cdk destroy --all --force

setup_eks:
	sh bin/setup.sh

deploy_otel:
	helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
	cd digital_q_demo && pip install pipenv && pipenv install && cdk8s synth && kubectl apply -f dist/
	sleep 60

forward:
	kubectl port-forward svc/digital-q-demo-otel-demo-c8df0828-frontendproxy 8080:8080

synth:
	cdk synth

complete_setup: deploy setup_eks deploy_otel forward
