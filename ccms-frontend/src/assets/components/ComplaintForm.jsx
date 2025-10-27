import { useForm } from 'react-hook-form';
import api from '../api/api';

export default function ComplaintForm(){
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const fd = new FormData();
    fd.append('title', data.title);
    fd.append('description', data.description);
    fd.append('category', data.category);
    fd.append('priority', data.priority);
    fd.append('location', data.location);
    fd.append('anonymous', data.anonymous ? 'true' : 'false');
    if(data.attachment?.[0]) fd.append('attachment', data.attachment[0]);

    await api.post('/complaints', fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // show success UI
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('title', {required:true})} placeholder="Short title"/>
      <textarea {...register('description', {required:true})} placeholder="Details"/>
      <select {...register('category')}>
        <option value="hostel">Hostel</option>
        <option value="academics">Academics</option>
        <option value="transport">Transport</option>
      </select>
      <select {...register('priority')}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      <input type="file" {...register('attachment')} />
      <label><input type="checkbox" {...register('anonymous')} /> Submit anonymously</label>
      <button type="submit" className="btn">Submit complaint</button>
    </form>
  );
}
