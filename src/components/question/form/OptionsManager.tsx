
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OptionsManagerProps {
  options: string[];
  correctAnswers: number[];
  onOptionChange: (index: number, value: string) => void;
  onCorrectAnswerChange: (index: number, isCorrect: boolean) => void;
}

const OptionsManager = ({
  options,
  correctAnswers,
  onOptionChange,
  onCorrectAnswerChange
}: OptionsManagerProps) => {
  return (
    <div>
      <Label>Answer Options *</Label>
      <p className="text-sm text-gray-600 mb-2">
        Provide 2-5 answer options. You can leave some options empty if you need fewer than 5 choices.
      </p>
      {options.map((option, index) => (
        <div key={index} className="flex items-center gap-2 mt-2">
          <Input
            value={option}
            onChange={(e) => onOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}${index < 2 ? ' (required)' : ' (optional)'}`}
            className={index < 2 ? "border-blue-300" : ""}
          />
          <input
            type="checkbox"
            checked={correctAnswers.includes(index)}
            onChange={(e) => onCorrectAnswerChange(index, e.target.checked)}
            disabled={option.trim() === ""}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-500 min-w-[50px]">Correct</span>
        </div>
      ))}
      <p className="text-xs text-gray-500 mt-1">
        * At least 2 options are required. You can mark multiple options as correct.
      </p>
    </div>
  );
};

export default OptionsManager;
