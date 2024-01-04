const QuadUvs: number[] = [
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
];

import { mat4, vec3 } from 'gl-matrix';

let NHolder: vec3;


function fPoint(A:vec3, uvx:number, uvy:number, memoryData, i) {
    
    memoryData[i++] = A[0];
    memoryData[i++] = A[1];
    memoryData[i++] = A[2];

    memoryData[i++] = uvx;
    memoryData[i++] = uvy;

    memoryData[i++] = NHolder[0];
    memoryData[i++] = NHolder[1];
    memoryData[i++] = NHolder[2];
}