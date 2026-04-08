import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { authApi } from '../../api/auth';
import { borrowingApi } from '../../api/borrowing';

interface CreateRequestModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateRequestModal: React.FC<CreateRequestModalProps> = ({ onClose, onSuccess }) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [itemImageBase64, setItemImageBase64] = useState<string | null>(null);

  React.useEffect(() => {
    if (startDate && startTime && endDate && endTime) {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      
      const diffMs = end.getTime() - start.getTime();
      if (diffMs < 0) {
        setDuration('Invalid: End must be after Start');
      } else {
        const diffHrs = diffMs / (1000 * 60 * 60);
        if (diffHrs > 24) {
          setDuration(`Exceeds 24 hrs (${diffHrs.toFixed(1)} hrs)`);
        } else {
          setDuration(`${diffHrs.toFixed(1)} hours`);
        }
      }
    } else {
      setDuration('');
    }
  }, [startDate, startTime, endDate, endTime]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        setItemImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = authApi.getCurrentUser();
      if (!user) {
        alert("Please log in first.");
        return;
      }
      
      const payload = {
        requesterId: user.id,
        itemName,
        description,
        purpose,
        startDate: `${startDate}T${startTime}:00`,
        endDate: `${endDate}T${endTime}:00`,
        itemImage: itemImageBase64
      };

      await borrowingApi.createRequest(payload);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to create request:", error);
      alert("Failed to create request. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Create Borrowing Request</h2>
          <button className="modal-close-btn" onClick={onClose} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <h3 className="modal-section-title">Request Information</h3>
          
          <div className="modal-form-group">
            <label className="modal-label">Item Name <span className="required">*</span></label>
            <input 
              type="text" 
              className="modal-input" 
              placeholder="Enter the name of item you would like to borrow"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Description <span className="required">*</span></label>
            <textarea 
              className="modal-textarea" 
              placeholder="Provide a description of the item you want to borrow or any messages you wan to include to the lender.."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="modal-form-group">
            <label className="modal-label">Purpose <span className="required">*</span></label>
            <input 
              type="text" 
              className="modal-input" 
              placeholder="State the purpose of your request"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              required
            />
          </div>

          <hr className="modal-divider" />

          <h3 className="modal-section-title">Borrowing Schedule</h3>

          <div className="modal-schedule-row">
            <div className="modal-schedule-col">
              <label className="modal-label">Start Date & Time<span className="required">*</span></label>
              <div className="modal-datetime-inputs">
                <input 
                  type="date" 
                  className="modal-input" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <select 
                  className="modal-select" 
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                >
                  <option value="" disabled>Select start time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="modal-schedule-col">
              <label className="modal-label">End Date & Time<span className="required">*</span></label>
              <div className="modal-datetime-inputs">
                <input 
                  type="date" 
                  className="modal-input" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                <select 
                  className="modal-select" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                >
                  <option value="" disabled>Select end time</option>
                  <option value="08:00">08:00 AM</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-note">
            Note: Borrowing duration must not exceed 24 hours.
          </div>

          <div className="modal-schedule-row">
            <div className="modal-schedule-col">
              <label className="modal-label">Total Duration:</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Borrowing Duration"
                value={duration}
                readOnly
              />
            </div>

            <div className="modal-schedule-col">
              <label className="modal-label">Upload Image (Optional):</label>
              <div 
                className="modal-upload-area" 
                onClick={() => document.getElementById('imageUpload')?.click()}
                style={{ cursor: 'pointer' }}
              >
                <Upload size={16} />
                <span>{itemImageBase64 ? 'Image Selected' : 'Upload file'}</span>
                <input 
                  type="file" 
                  id="imageUpload" 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="modal-btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn-submit">Post Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestModal;
