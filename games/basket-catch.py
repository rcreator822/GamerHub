import pygame
import random

# Initialize pygame
pygame.init()

# Set up display
WIDTH, HEIGHT = 800, 600
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Catch the Apples")

# Colors
WHITE = (255, 255, 255)
RED = (200, 0, 0)
BROWN = (150, 75, 0)

# Basket properties
basket_width, basket_height = 100, 20
basket_x = WIDTH // 2 - basket_width // 2
basket_y = HEIGHT - 40
basket_speed = 10

# Apple properties
apple_radius = 10
apple_x = random.randint(apple_radius, WIDTH - apple_radius)
apple_y = 0
apple_speed = 5

# Game loop variables
running = True
score = 0
font = pygame.font.Font(None, 36)

while running:
    screen.fill(WHITE)

    # Handle events
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    # Get key state
    keys = pygame.key.get_pressed()
    if keys[pygame.K_LEFT] and basket_x > 0:
        basket_x -= basket_speed
    if keys[pygame.K_RIGHT] and basket_x < WIDTH - basket_width:
        basket_x += basket_speed

    # Move apple
    apple_y += apple_speed

    # Check for collision
    if apple_y + apple_radius >= basket_y and basket_x < apple_x < basket_x + basket_width:
        score += 1
        apple_x = random.randint(apple_radius, WIDTH - apple_radius)
        apple_y = 0

    # Reset apple if it falls off
    if apple_y > HEIGHT:
        apple_x = random.randint(apple_radius, WIDTH - apple_radius)
        apple_y = 0

    # Draw basket
    pygame.draw.rect(screen, BROWN, (basket_x, basket_y, basket_width, basket_height))

    # Draw apple
    pygame.draw.circle(screen, RED, (apple_x, apple_y), apple_radius)

    # Draw score
    score_text = font.render(f"Score: {score}", True, (0, 0, 0))
    screen.blit(score_text, (10, 10))

    pygame.display.flip()
    pygame.time.delay(30)

pygame.quit()
