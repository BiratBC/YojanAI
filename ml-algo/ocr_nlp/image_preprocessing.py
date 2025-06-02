# Image Preprocessing

import cv2
import numpy as np
from PIL import Image

def preprocessing_image(IMAGE_PATH):
    # Load Image
    # Convert to grayscale
    # Apply gaussian blur
    # Applying threshold to convert to the binary image
    # Other preprocessing......
    # convert back to PIL image
    pass

# Countours -> these are the geometrical boundary which decides the object/text


# image = cv2.imread("media/class-routine-3.png")
# gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

# # Invert version for white-text detection
# inverted = cv2.bitwise_not(gray)

# # Threshold (optional, can help isolate characters)
# thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, 
#                                cv2.THRESH_BINARY, 15, 10)
# inv_thresh = cv2.bitwise_not(thresh)

# # Find contours (use the inverse to find white boxes on black)
# contours, _ = cv2.findContours(inv_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# results = []

# for cnt in contours:
#     x, y, w, h = cv2.boundingRect(cnt)

#     # Filter small/large boxes
#     if w < 40 or h < 30 or w > 500 or h > 300:
#         continue

#     # Crop ROI from original and inverted
#     roi_orig = gray[y:y+h, x:x+w]
#     roi_invert = inverted[y:y+h, x:x+w]

#     # OCR both versions
#     text_orig = pytesseract.image_to_string(roi_orig, config='--psm 6').strip()
#     text_invert = pytesseract.image_to_string(roi_invert, config='--psm 6').strip()

#     # Choose whichever has more characters
#     final_text = text_orig if len(text_orig) >= len(text_invert) else text_invert

#     if final_text:
#         results.append({
#             "position": {"x": x, "y": y, "width": w, "height": h},
#             "text": final_text
#         })

# # Sort left to right, top to bottom
# results = sorted(results, key=lambda b: (b['position']['y']//10, b['position']['x']))

# # Save to JSON
# with open("final_timetable.json", "w") as f:
#     json.dump(results, f, indent=2)

# print(f"✅ Final output with {len(results)} boxes extracted.")