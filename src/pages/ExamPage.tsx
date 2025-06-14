
import { useParams } from "react-router-dom";

const ExamPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Exam: {id}</h1>
        <p className="text-gray-600">Exam interface will be implemented here</p>
      </div>
    </div>
  );
};

export default ExamPage;
