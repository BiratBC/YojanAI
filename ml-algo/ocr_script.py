import sys
import cv2
import pytesseract

image_path = sys.argv[1]

img = cv2.imread(image_path)
text = pytesseract.image_to_string(img)
print(text)
