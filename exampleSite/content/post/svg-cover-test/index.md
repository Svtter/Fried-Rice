+++
title = "SVG Cover Test"
date = "2024-01-01"
description = "Demonstrates a vector (SVG) cover image"
categories = ["Test"]
tags = ["svg"]
image = "cover.svg"
+++

This post's cover is an SVG page-bundle resource. Vector images are not
processible by Hugo's image pipeline, so they are rendered as-is rather than
passed through `.Fill` — a regression fixture for issue #30.

