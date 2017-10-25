#!/bin/bash

echo "Creating symlinks for font-awesome fonts in static/fonts/font_awesome"
ln -r -s node_modules/font-awesome/fonts static/fonts/font_awesome

echo "Creating symlinks for material design icon fonts"
echo "in static/fonts/material_design_icons"
ln -r -s node_modules/material-design-icons/iconfont static/fonts/material_design_icons
