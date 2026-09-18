---
title: "{{ replace .Name "-" " " | title }}"
description: 
date: {{ .Date }}
image: 
math: 
license: 
comments: true
draft: true
series:             # e.g. ["My Series"] — optional, groups posts into a series
weight:             # Optional ordering within a series (higher = shown earlier)
build:
    list: always    # Change to "never" to hide the page from the list
---