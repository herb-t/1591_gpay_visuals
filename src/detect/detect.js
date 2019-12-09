/**
 * @fileoverview Detects app support for minimum browser requirements and
 * allows developer to conditionally bootstrap the app.
 */
import {Detect, FlexboxFeature, TouchFeature} from '@google/glue';

Detect.decorateDom(FlexboxFeature);
Detect.decorateDom(TouchFeature);

export {};
