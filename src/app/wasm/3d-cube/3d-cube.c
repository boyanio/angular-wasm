/* Code modified from http://www.lousodrome.net/opengl/ */

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <GL/glut.h>
#include <SOIL.h>
#include <emscripten.h>

#define		SIZE	256

static int window_width = 500;
static int window_height = 500;

/*
** Just a textured cube
*/
void Cube(void) {
	glBegin(GL_QUADS);

	glTexCoord2i(0, 0); glVertex3f(-1, -1, -1);
	glTexCoord2i(0, 1); glVertex3f(-1, -1, 1);
	glTexCoord2i(1, 1); glVertex3f(-1, 1, 1);
	glTexCoord2i(1, 0); glVertex3f(-1, 1, -1);

	glTexCoord2i(0, 0); glVertex3f(1, -1, -1);
	glTexCoord2i(0, 1); glVertex3f(1, -1, 1);
	glTexCoord2i(1, 1); glVertex3f(1, 1, 1);
	glTexCoord2i(1, 0); glVertex3f(1, 1, -1);

	glTexCoord2i(0, 0); glVertex3f(-1, -1, -1);
	glTexCoord2i(0, 1); glVertex3f(-1, -1, 1);
	glTexCoord2i(1, 1); glVertex3f(1, -1, 1);
	glTexCoord2i(1, 0); glVertex3f(1, -1, -1);

	glTexCoord2i(0, 0); glVertex3f(-1, 1, -1);
	glTexCoord2i(0, 1); glVertex3f(-1, 1, 1);
	glTexCoord2i(1, 1); glVertex3f(1, 1, 1);
	glTexCoord2i(1, 0); glVertex3f(1, 1, -1);

	glTexCoord2i(0, 0); glVertex3f(-1, -1, -1);
	glTexCoord2i(0, 1); glVertex3f(-1, 1, -1);
	glTexCoord2i(1, 1); glVertex3f(1, 1, -1);
	glTexCoord2i(1, 0); glVertex3f(1, -1, -1);

	glTexCoord2i(0, 0); glVertex3f(-1, -1, 1);
	glTexCoord2i(0, 1); glVertex3f(-1, 1, 1);
	glTexCoord2i(1, 1); glVertex3f(1, 1, 1);
	glTexCoord2i(1, 0); glVertex3f(1, -1, 1);

	glEnd();
}

/*
** Function called to update rendering
*/
void DisplayFunc(void) {
	static float alpha = 20;

	glLoadIdentity();
	glTranslatef(0, 0, -10);
	glRotatef(30, 1, 0, 0);
	glRotatef(alpha, 0, 1, 0);

	/* Define a view-port adapted to the texture */
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(20, 1, 5, 15);
	glViewport(0, 0, SIZE, SIZE);
	glMatrixMode(GL_MODELVIEW);

	/* Render to buffer */
	glClearColor(1, 1, 1, 0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	Cube();
	glFlush();

	/* Render to screen */
	glMatrixMode(GL_PROJECTION);
	glLoadIdentity();
	gluPerspective(20, window_width / (float)window_height, 5, 15);
	glViewport(0, 0, window_width, window_height);
	glMatrixMode(GL_MODELVIEW);
	glClearColor(1, 1, 1, 0);
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	Cube();

	/* End */
	glFlush();
	glutSwapBuffers();

	/* Update again and again */
	alpha = alpha + 0.1;
	glutPostRedisplay();
}

/*
** Function called when the window is created or resized
*/
void ReshapeFunc(int width, int height) {
	window_width = width;
	window_height = height;
	glutPostRedisplay();
}

#ifndef __EMSCRIPTEN__

/*
** Function called when a key is hit
*/
void KeyboardFunc(unsigned char key, int x, int y) {
	int foo;

	foo = x + y; /* Has no effect: just to avoid a warning */
	if ('q' == key || 'Q' == key || 27 == key)
		exit(0);
}

#endif // !__EMSCRIPTEN__

EMSCRIPTEN_KEEPALIVE
void set_texture(const char* fileName) {
	int texture_width, texture_height;
	unsigned char* texture = SOIL_load_image(fileName, &texture_width, &texture_height, 0, SOIL_LOAD_RGB);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, texture_width, texture_height, 0, GL_RGB, GL_UNSIGNED_BYTE, texture);
	SOIL_free_image_data(texture);
}

int main(int argc, char **argv) {

	if (argc != 2) {
		printf("You should supply one and only one parameter: the initial texture image\n");
		return -1;
	}

	/* Creation of the window */
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGB | GLUT_DOUBLE | GLUT_DEPTH);
	glutInitWindowSize(500, 500);
	glutCreateWindow("Render to texture");

	/* OpenGL settings */
	glEnable(GL_DEPTH_TEST);

	/* Texture setting */
	unsigned int texture_id;
	glEnable(GL_TEXTURE_2D);
	glGenTextures(1, &texture_id);
	glBindTexture(GL_TEXTURE_2D, texture_id);

	/* Load and apply the texture */
	set_texture(argv[1]);

	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

	/* Declaration of the callbacks */
	glutDisplayFunc(&DisplayFunc);
	glutReshapeFunc(&ReshapeFunc);
#ifndef __EMSCRIPTEN__
	glutKeyboardFunc(&KeyboardFunc);
#endif // !__EMSCRIPTEN__

	/* Loop */
	glutMainLoop();

	/* Never reached */
	return 0;
}