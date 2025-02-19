#version 410 core

in vec3 fPosition;
in vec3 fNormal;
in vec2 fTexCoords;
in vec4 FragPosLightSpace;
out vec4 fColor;

//skybox
uniform samplerCube skybox;
vec3 reflectionColor;

//matrices
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
//lighting
uniform vec3 lightDir;
uniform vec3 lightColor;
// textures
uniform sampler2D diffuseTexture;
uniform sampler2D specularTexture;
uniform sampler2D shadowMap;
//components
vec3 ambient;
float ambientStrength = 0.2f;
vec3 diffuse;
vec3 specular;
float specularStrength = 0.5f;



float calculateShadow(vec4 fragPosLightSpace) {
    
    vec3 projCoords = fragPosLightSpace.xyz / fragPosLightSpace.w;
    projCoords = projCoords * 0.5 + 0.5;

    // Citim adâncimea din textura umbrei
    float closestDepth = texture(shadowMap, projCoords.xy).r;
    float currentDepth = projCoords.z;

    // Calculăm dacă pixelul este în umbră
    float shadow = currentDepth > closestDepth + 0.005 ? 1.0 : 0.0;
    return shadow;
}

void computeDirLight()
{
    //compute eye space coordinates
    vec4 fPosEye = view * model * vec4(fPosition, 1.0f);
    vec3 normalEye = normalize(normalMatrix * fNormal);

    //normalize light direction
    vec3 lightDirN = vec3(normalize(view * vec4(lightDir, 0.0f)));

    //compute view direction (in eye coordinates, the viewer is situated at the origin
    vec3 viewDir = normalize(- fPosEye.xyz);

    //compute ambient light
    ambient = ambientStrength * lightColor;

    //compute diffuse light
    diffuse = max(dot(normalEye, lightDirN), 0.0f) * lightColor;

    //compute specular light
    vec3 reflectDir = reflect(-lightDirN, normalEye);
    float specCoeff = pow(max(dot(viewDir, reflectDir), 0.0f), 32);
    specular = specularStrength * specCoeff * lightColor;

     //compute reflection color from skybox
    vec3 reflectionDir = reflect(-viewDir, normalEye);
    reflectionColor = texture(skybox, reflectionDir).rgb;
}

void main() 
{
    computeDirLight();

    //compute final vertex color
    //vec3 color = min((ambient + diffuse) * texture(diffuseTexture, fTexCoords).rgb + specular * texture(specularTexture, fTexCoords).rgb, 1.0f);
    //fColor = vec4(color, 1.0f);

    vec3 textureColor = texture(diffuseTexture, fTexCoords).rgb;
    vec3 specularColor = specular * texture(specularTexture, fTexCoords).rgb;

    // Blend object texture and reflection
    vec3 color = min((ambient + diffuse) * textureColor + specularColor, 1.0f);
    color = mix(color, reflectionColor, 0.2); // Adjust reflection strength (e.g., 0.2)
    
    fColor = vec4(color, 1.0f);

}       