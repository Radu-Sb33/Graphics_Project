#include "Camera.hpp"
#include <glm/glm.hpp>//core glm functionality
#include <glm/gtc/matrix_transform.hpp>//glm extension for generating common transformation matrices
#include <glm/gtc/type_ptr.hpp>//glm extension for accessing the internal data structure of glm types

#include <glm/gtx/euler_angles.hpp>
#include "Shader.hpp"

namespace gps {

    //Camera constructor
    Camera::Camera(glm::vec3 cameraPosition, glm::vec3 cameraTarget, glm::vec3 cameraUp) {
        this->cameraPosition = cameraPosition;
        this->cameraTarget = cameraTarget;
        this->cameraUpDirection = glm::normalize(cameraUp);


        cameraFrontDirection = glm::normalize(cameraTarget - cameraPosition);
        cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, cameraUpDirection));

    }

    //return the view matrix, using the glm::lookAt() function
    glm::mat4 Camera::getViewMatrix() {
        //TODO


        return glm::lookAt(cameraPosition, cameraPosition + cameraFrontDirection, cameraUpDirection);

    }

    //update the camera internal parameters following a camera move event
    void Camera::move(MOVE_DIRECTION direction, float speed) {
        if (direction == MOVE_FORWARD) {
            cameraPosition -= speed * cameraFrontDirection;
        }
        else if (direction == MOVE_BACKWARD) {
            cameraPosition += speed * cameraFrontDirection;
        }
        else if (direction == MOVE_LEFT) {
            cameraPosition -= speed * cameraRightDirection;
        }
        else if (direction == MOVE_RIGHT) {
            cameraPosition += speed * cameraRightDirection;
        }
        //TODO
    }

    //update the camera internal parameters following a camera rotate event
    //yaw - camera rotation around the y axis
    //pitch - camera rotation around the x axis
    void Camera::rotate(float pitch, float yaw) {
        // Limitam pitch-ul intre -89 si 89 de grade pentru a preveni inversarea
        if (pitch > 89.0f)
            pitch = 89.0f;
        if (pitch < -89.0f)
            pitch = -89.0f;

        // Convertim pitch si yaw din grade in radiani
        float radPitch = glm::radians(pitch);
        float radYaw = glm::radians(yaw);

        // Calculam noul vector front, \( v \)
        glm::vec3 front;
        front.x = cos(radYaw) * cos(radPitch);
        front.y = sin(radPitch);
        front.z = sin(radYaw) * cos(radPitch);
        cameraFrontDirection = glm::normalize(front);


        cameraRightDirection = glm::normalize(glm::cross(cameraFrontDirection, glm::vec3(0.0f, 1.0f, 0.0f)));


        cameraUpDirection = glm::normalize(glm::cross(cameraRightDirection, cameraFrontDirection));
    }

}