# general util
import os
import PIL
import sys
import csv
import numpy as np

# anomalib
from anomalib.visualization import visualize_anomaly_map
from anomalib.deploy import TorchInferencer

model = TorchInferencer(path='./model/weights/torch/anomaly_detection_model.pt')

def overlay_images(base_image_path, overlay_image, output_path=None, alpha=0.3):
    """
    Overlay a semi-transparent image on top of a base image
    
    Args:
        base_image_path (str): Path to base image
        overlay_image (PIL.Image): Image to overlay (will be resized to match base)
        output_path (str, optional): Path to save result. If None, returns PIL.Image
        alpha (float): Opacity of overlay (0.0=transparent, 1.0=opaque)
    """
    # Open base image and convert to RGBA
    base = PIL.Image.open(base_image_path)
    
    # Handle palette-based images (e.g., some PNGs)
    if base.mode in ('RGBA', 'P'):
        base = base.convert("RGBA")
    else:
        base = base.convert("RGB").convert("RGBA")

    # Resize overlay to match base image size
    overlay = overlay_image.resize(base.size).convert("RGBA")

    # Create alpha mask for overlay
    alpha_mask = overlay.copy()
    alpha_mask.putalpha(int(255 * alpha))  # Apply transparency

    # Composite images
    combined = PIL.Image.alpha_composite(base, alpha_mask)

    # Save or return
    if output_path:
        combined.save(output_path)
    else:
        return combined

def process_image(img_path):
    name = img_path.split('/')[-1]
    name = name.split('.')[0]
    prediction = model.predict(img_path)

    vis = visualize_anomaly_map(prediction.anomaly_map, colormap=True, normalize=True)
    # vis = visualize_pred_mask(prediction.pred_mask)
    vis = overlay_images(img_path, vis)

    pred_score = prediction.pred_score

    if pred_score < .70:
        vis.save(f'./normal/{name}.png')

    elif pred_score < .90:
        vis.save(f'./unsure/{name}.png')

    else:
        vis.save(f'./anomalies/{name}.png')
    
    
    
    return pred_score[0,0].item()
        

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python eval_model.py <image_path>")
        sys.exit(1)
    print(process_image(sys.argv[1]))
