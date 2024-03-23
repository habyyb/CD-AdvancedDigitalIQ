#!/usr/bin/env python
from constructs import Construct
from cdk8s import App, Chart, Helm


class MyChart(Chart):
    def __init__(self, scope: Construct, id: str):
        super().__init__(scope, id)

        otel_demo = Helm(self, "otel-demo",
                    chart= "open-telemetry/opentelemetry-demo")


app = App()
MyChart(app, "digital-q-demo")

app.synth()