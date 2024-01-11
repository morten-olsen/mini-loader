#!/bin/bash

mini-loader loads push src/simple.ts -i foo
mini-loader loads ls
mini-loader runs create foo
mini-loader runs ls
mini-loader logs ls -a 1000