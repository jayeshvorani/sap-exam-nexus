
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Upload, Download, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { parseCSV, downloadCSVTemplate, ImportResult, ImportError } from "@/utils/csvImport";

interface ImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExamId: string;
  onImport: (questions: any[]) => Promise<boolean>;
}

const ImportDialog = ({
  isOpen,
  onOpenChange,
  selectedExamId,
  onImport
}: ImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImportResult(null);
      setShowPreview(false);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const result = parseCSV(text);
      
      // Set exam_id for questions if not provided
      result.validQuestions = result.validQuestions.map(q => ({
        ...q,
        exam_id: q.exam_id === 'your-exam-id-here' ? selectedExamId : q.exam_id
      }));
      
      setImportResult(result);
      setShowPreview(true);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setImportResult({
        success: false,
        validQuestions: [],
        errors: [{ row: 0, message: 'Failed to parse CSV file. Please check the format.' }],
        totalRows: 0,
        skippedRows: 0
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!importResult?.validQuestions.length) return;

    setIsProcessing(true);
    const success = await onImport(importResult.validQuestions);
    if (success) {
      setFile(null);
      setImportResult(null);
      setShowPreview(false);
      onOpenChange(false);
    }
    setIsProcessing(false);
  };

  const handleDownloadTemplate = () => {
    downloadCSVTemplate(selectedExamId);
  };

  const reset = () => {
    setFile(null);
    setImportResult(null);
    setShowPreview(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Import Questions from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with questions to bulk import into your exam
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download Section */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-blue-900">CSV Template</h4>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Download the CSV template to ensure proper formatting for your questions.
            </p>
            <Button variant="outline" onClick={handleDownloadTemplate} size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          <Separator />

          {/* File Upload Section */}
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <div className="mt-2">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                disabled={isProcessing}
              />
            </div>
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          {/* Preview Button */}
          {file && !showPreview && (
            <Button onClick={handlePreview} disabled={isProcessing}>
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Preview Import'}
            </Button>
          )}

          {/* Import Results */}
          {importResult && showPreview && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {importResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                )}
                <h4 className="font-medium">Import Preview</h4>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">Total Rows</div>
                  <div className="text-lg">{importResult.totalRows}</div>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <div className="font-medium text-green-700">Valid Questions</div>
                  <div className="text-lg text-green-800">{importResult.validQuestions.length}</div>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <div className="font-medium text-red-700">Errors</div>
                  <div className="text-lg text-red-800">{importResult.errors.length}</div>
                </div>
              </div>

              {/* Errors */}
              {importResult.errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Import Errors:</div>
                    <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                      {importResult.errors.slice(0, 10).map((error, index) => (
                        <div key={index}>
                          Row {error.row}: {error.field && `${error.field} - `}{error.message}
                        </div>
                      ))}
                      {importResult.errors.length > 10 && (
                        <div className="text-xs text-muted-foreground">
                          ... and {importResult.errors.length - 10} more errors
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Valid Questions Preview */}
              {importResult.validQuestions.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2">Questions to Import ({importResult.validQuestions.length})</h5>
                  <div className="bg-gray-50 p-3 rounded max-h-40 overflow-y-auto text-sm">
                    {importResult.validQuestions.slice(0, 3).map((question, index) => (
                      <div key={index} className="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                        <div className="font-medium">{question.question_text}</div>
                        <div className="text-gray-600">
                          Options: {question.options.join(', ')} | 
                          Correct: {question.options[question.correct_answers[0]]} | 
                          Difficulty: {question.difficulty}
                        </div>
                      </div>
                    ))}
                    {importResult.validQuestions.length > 3 && (
                      <div className="text-xs text-gray-500">
                        ... and {importResult.validQuestions.length - 3} more questions
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {showPreview && (
              <>
                <Button variant="outline" onClick={reset}>
                  Choose Different File
                </Button>
                {importResult?.validQuestions.length > 0 && (
                  <Button 
                    onClick={handleImport} 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Importing...' : `Import ${importResult.validQuestions.length} Questions`}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportDialog;
