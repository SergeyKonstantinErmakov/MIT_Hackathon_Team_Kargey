from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys
import subprocess
import uuid
from werkzeug.utils import secure_filename
from eval_model import process_image

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'  # Folder to store uploaded images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload_images', methods=['POST'])
def upload_images():
    """Handle image uploads and return saved paths"""
    saved_paths = []
    # Ensure upload folder exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

    # Check if files were uploaded
    if 'images[]' not in request.files:
        return jsonify({
            'success': False,
            'error': 'No files uploaded',
            'saved_paths': saved_paths
        })

    files = request.files.getlist('images[]')

    for file in files:
        try:
            # Validate file
            if file.filename == '':
                continue

            if not allowed_file(file.filename):
                continue

            # Generate secure filename
            filename = secure_filename(f"{uuid.uuid4()}{os.path.splitext(file.filename)[1]}")
            save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)

            # Save file
            file.save(save_path)
            
            # Verify successful save
            if os.path.exists(save_path):
                saved_paths.append(save_path)
                print(f"Successfully saved: {save_path}")
            else:
                print(f"Failed to save: {filename}")

        except Exception as e:
            print(f"Error processing {file.filename}: {str(e)}")
            continue

    return jsonify({
        'success': bool(saved_paths),
        'saved_paths': saved_paths,
        'message': f'Saved {len(saved_paths)} files' if saved_paths else 'No files saved'
    })

@app.route('/run_python_script')
def run_python_script():
    try:
        image_path = request.args.get('image_path')
        
        if not os.path.exists(image_path):
            return jsonify({'success': False, 'error': 'File not found'})

        # Directly call the processing function
        pred_score = process_image(image_path)
        
        return jsonify({
            'success': True,
            'pred_score': pred_score,
            'message': 'Processed successfully'
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

        
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'error': 'Script timed out after 10 seconds'
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)