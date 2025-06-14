export interface CSVQuestion {
  question_text: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  correct_answers: string;
  difficulty: string;
  explanation: string;
  exam_id: string;
  image_url: string;
}

export interface ImportResult {
  success: boolean;
  validQuestions: any[];
  errors: ImportError[];
  totalRows: number;
  skippedRows: number;
}

export interface ImportError {
  row: number;
  field?: string;
  message: string;
  data?: string;
}

export const validateCSVQuestion = (data: string[], rowIndex: number): ImportError[] => {
  const errors: ImportError[] = [];
  
  if (!data[0]?.trim()) {
    errors.push({
      row: rowIndex,
      field: 'question_text',
      message: 'Question text is required'
    });
  }

  // Check for at least 2 options
  const options = [data[1], data[2], data[3], data[4], data[5]].filter(opt => opt?.trim());
  if (options.length < 2) {
    errors.push({
      row: rowIndex,
      field: 'options',
      message: 'At least 2 answer options are required'
    });
  }

  // Validate correct answers (now supports multiple)
  const correctAnswers = data[6]?.trim();
  if (!correctAnswers) {
    errors.push({
      row: rowIndex,
      field: 'correct_answers',
      message: 'Correct answers are required'
    });
  } else {
    // Parse multiple correct answers (comma-separated)
    const correctIndices = correctAnswers.split(',').map(ans => parseInt(ans.trim()) - 1);
    
    for (const correctIndex of correctIndices) {
      if (isNaN(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
        errors.push({
          row: rowIndex,
          field: 'correct_answers',
          message: `Correct answer must be a number between 1 and ${options.length}. Use comma-separated values for multiple correct answers (e.g., "1,3")`
        });
        break;
      }
    }
  }

  // Validate difficulty
  const difficulty = data[7]?.trim().toLowerCase();
  if (difficulty && !['easy', 'medium', 'hard'].includes(difficulty)) {
    errors.push({
      row: rowIndex,
      field: 'difficulty',
      message: 'Difficulty must be one of: easy, medium, hard'
    });
  }

  // Validate exam_id
  if (!data[9]?.trim()) {
    errors.push({
      row: rowIndex,
      field: 'exam_id',
      message: 'Exam ID is required'
    });
  }

  // Validate image_url (optional but check format if provided)
  const imageUrl = data[10]?.trim();
  if (imageUrl && !imageUrl.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
    errors.push({
      row: rowIndex,
      field: 'image_url',
      message: 'Image URL must be a valid HTTP/HTTPS URL ending with .jpg, .jpeg, .png, .gif, or .webp'
    });
  }

  return errors;
};

export const parseCSV = (csvText: string): ImportResult => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const errors: ImportError[] = [];
  const validQuestions: any[] = [];
  let skippedRows = 0;

  // Skip header row
  const dataLines = lines.slice(1);

  dataLines.forEach((line, index) => {
    const rowIndex = index + 2; // +2 because we skip header and arrays are 0-indexed
    
    if (!line.trim()) {
      skippedRows++;
      return;
    }

    // Parse CSV line (simple comma splitting - could be enhanced for quoted values)
    const values = line.split(',').map(val => val.trim().replace(/^["']|["']$/g, ''));
    
    if (values.length < 11) {
      errors.push({
        row: rowIndex,
        message: `Row has ${values.length} columns, expected 11`,
        data: line
      });
      return;
    }

    const rowErrors = validateCSVQuestion(values, rowIndex);
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
      return;
    }

    // Create valid question object
    const options = [values[1], values[2], values[3], values[4], values[5]]
      .filter(opt => opt?.trim() !== '');
    
    // Parse multiple correct answers
    const correctAnswerIndices = values[6].split(',').map(ans => parseInt(ans.trim()) - 1);

    validQuestions.push({
      question_text: values[0].trim(),
      options,
      correct_answers: correctAnswerIndices,
      difficulty: values[7]?.trim().toLowerCase() || 'medium',
      explanation: values[8]?.trim() || '',
      exam_id: values[9].trim(),
      image_url: values[10]?.trim() || null,
      question_type: 'multiple_choice'
    });
  });

  return {
    success: errors.length === 0,
    validQuestions,
    errors,
    totalRows: dataLines.length,
    skippedRows
  };
};

export const generateCSVTemplate = (examId?: string): string => {
  const headers = [
    'question_text',
    'option1',
    'option2', 
    'option3',
    'option4',
    'option5',
    'correct_answers',
    'difficulty',
    'explanation',
    'exam_id',
    'image_url'
  ];

  const sampleRow = [
    'What is the capital of France?',
    'London',
    'Berlin',
    'Paris',
    'Madrid',
    '',
    '3',
    'easy',
    'Paris is the capital and largest city of France.',
    examId || 'your-exam-id-here',
    'https://example.com/image.jpg'
  ];

  const multipleCorrectSampleRow = [
    'Which of the following are programming languages? (Select all that apply)',
    'JavaScript',
    'HTML',
    'Python',
    'CSS',
    'Java',
    '1,3,5',
    'medium',
    'JavaScript, Python, and Java are programming languages. HTML and CSS are markup/styling languages.',
    examId || 'your-exam-id-here',
    ''
  ];

  return [
    headers.join(','),
    sampleRow.map(cell => `"${cell}"`).join(','),
    multipleCorrectSampleRow.map(cell => `"${cell}"`).join(',')
  ].join('\n');
};

export const downloadCSVTemplate = (examId?: string, filename: string = 'question_template.csv') => {
  const csvContent = generateCSVTemplate(examId);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
