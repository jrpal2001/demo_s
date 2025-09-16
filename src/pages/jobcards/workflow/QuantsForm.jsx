// import React, { useState } from 'react';
// import { InputField, NumberInput } from '@/components/custom/FormUtils';
// import { updateSizesAndRemarks } from '@/utils/api'; // Import the update function
// import axios from 'axios';
// import Modal from 'react-modal'; // Import react-modal

// const QuantUpdate = ({ jobCardNo, department, onSuccess, isOpen, onClose }) => {
//   const [sizes, setSizes] = useState({
//     xs: '',
//     s: '',
//     m: '',
//     l: '',
//     xl: '',
//     '2xl': '',
//     '3xl': '',
//     '4xl': '',
//     '5xl': '',
//     total: '',
//   });
//   const [remarks, setRemarks] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSizeChange = (size, value) => {
//     setSizes((prevSizes) => ({
//       ...prevSizes,
//       [size]: value,
//     }));
//   };

//   const handleRemarksChange = (e) => {
//     setRemarks(e.target.value);
//   };

//   const handleSubmit = async () => {
//     setLoading(true);

//     try {
//       const updatedData = await updateSizesAndRemarks(jobCardNo, department, sizes, remarks);
//       if (updatedData) {
//         onSuccess(updatedData);
//         setLoading(false);
//         alert('Sizes and remarks updated successfully');
//         onClose(); // Close the modal after success
//       } else {
//         setLoading(false);
//         alert('Failed to update sizes and remarks');
//       }
//     } catch (error) {
//       setLoading(false);
//       console.error('Error updating sizes and remarks:', error);
//       alert('An error occurred while updating');
//     }
//   };

//   return (
//     <Modal
//       isOpen={isOpen}
//       onRequestClose={onClose} // Close modal when clicked outside or pressing the close button
//       contentLabel="Update Quantities"
//       ariaHideApp={false}
//     >
//       <div className="quant-update-modal">
//         <h2>Update Quantities for {department}</h2>

//         {/* Render Size Inputs */}
//         <div className="sizes">
//           <h3>Sizes</h3>
//           {Object.keys(sizes).map((size) => (
//             <div key={size}>
//               <label>{size.toUpperCase()}</label>
//               <NumberInput
//                 value={sizes[size]}
//                 onChange={(value) => handleSizeChange(size, value)}
//               />
//             </div>
//           ))}
//         </div>

//         {/* Remarks Input */}
//         <div>
//           <h3>Remarks</h3>
//           <InputField value={remarks} onChange={handleRemarksChange} placeholder="Enter remarks" />
//         </div>

//         {/* Submit Button */}
//         <div>
//           <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
//             {loading ? 'Updating...' : 'Update Quantities'}
//           </button>
//         </div>

//         {/* Close Button */}
//         <button className="btn btn-secondary" onClick={onClose}>
//           Close
//         </button>
//       </div>
//     </Modal>
//   );
// };

// export default QuantUpdate;
