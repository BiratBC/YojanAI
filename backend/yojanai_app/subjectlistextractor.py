# subject_list_extractor.py

import cv2
import numpy as np
from PIL import Image
import pytesseract
import json
import re
import os

class SubjectListExtraction:
    def __init__(self, image_path):
        self.image_path = image_path
        self.image = None
        self.table = []

    def image_pre_processing(self):
        # Load and preprocess image
        self.image = cv2.imread(self.image_path)
        gray = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)

        # Optional: save threshold image
        os.makedirs("temp", exist_ok=True)
        cv2.imwrite('temp/binary_image.png', thresh)

        # Dilate image to emphasize characters
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (10, 2))
        dilated = cv2.dilate(thresh, kernel, iterations=1)
        cv2.imwrite('temp/white_thickened_dilated.png', dilated)

        # Find contours (text regions)
        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        boxes = [cv2.boundingRect(c) for c in contours]
        boxes = sorted(boxes, key=lambda b: (b[1], b[0]))

        # Group into rows
        rows = []
        current_row = []
        row_y_threshold = 15

        for box in boxes:
            x, y, w, h = box
            if not current_row:
                current_row.append(box)
            elif abs(y - current_row[-1][1]) <= row_y_threshold:
                current_row.append(box)
            else:
                rows.append(sorted(current_row, key=lambda b: b[0]))
                current_row = [box]
        if current_row:
            rows.append(sorted(current_row, key=lambda b: b[0]))

        # Extract text from each box
        for row in rows:
            row_data = []
            for (x, y, w, h) in row:
                roi = self.image[y:y + h, x:x + w]
                text = pytesseract.image_to_string(roi, config='--psm 6').strip()
                row_data.append(text)
            self.table.append(row_data)

    def create_json_format(self):
        if not self.table or len(self.table) < 2:
            raise ValueError("Insufficient data to create JSON.")

        header = self.table[0]
        json_data = []

        hardcoded_credits = {
            "Laboratory Work": 1,
        }

        def extract_credit(val):
            match = re.search(r'\d+', val)
            if match:
                return int(match.group())
            return 2  # default credit

        for row in self.table[1:]:
            if len(row) == 2:
                row = ["", row[0], row[1]]  # Fill subject code as empty
            elif len(row) < len(header):
                row += [""] * (len(header) - len(row))  # pad row

            item = {}
            subj_val = row[header.index("Subject")].strip()
            for i, cell in enumerate(row):
                key = header[i]
                val = cell
                if "Credit" in key:
                    val = (
                        hardcoded_credits[subj_val]
                        if subj_val in hardcoded_credits
                        else extract_credit(val)
                    )
                item[key] = val
            json_data.append(item)

        # Output
        return json.dumps(json_data, indent=2)
