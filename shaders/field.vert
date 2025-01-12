#version 410 core

layout(location=0) in vec3 vPosition;
layout(location=1) in vec3 vNormal;
layout(location=2) in vec2 vTexCoords;

out vec3 fPosition;
out vec3 fNormal;
out vec2 fTexCoords;

uniform mat4 view;
uniform mat4 projection;

// Constante pentru mișcare
const float speed = 0.5;
const float amplitude = 1.0;

void main() 
{
    // Calcularea unui timp implicit bazat pe gl_VertexID
    float time = 2.0 * speed; // Alternativ, poți folosi gl_VertexID
    float offset = sin(time) * amplitude;

    // Adaugă translația pe axa X
    vec3 animatedPosition = vPosition + vec3(offset, 0.0, 0.0);

    // Transformați poziția în spațiul clip
    gl_Position = projection * view * vec4(animatedPosition, 1.0f);
    
    // Transmiteți atributele către fragment shader
    fPosition = animatedPosition;
    fNormal = vNormal;
    fTexCoords = vTexCoords;
}
