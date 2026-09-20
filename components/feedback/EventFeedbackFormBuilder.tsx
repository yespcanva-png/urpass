"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Star,
  CheckSquare,
  CircleDot,
  Type,
  AlignLeft,
  ToggleLeft,
  Sparkles,
  Check,
  Palette,
  Sliders,
  HelpCircle,
  Zap,
} from "lucide-react";
import {
  type EventFeedbackFormConfig,
  type FormQuestion,
  type QuestionType,
  type FormBrandingTheme,
  FORM_TEMPLATES,
  FORM_THEME_PRESETS,
} from "@/lib/event-feedback";

interface Props {
  config: EventFeedbackFormConfig;
  onChange: (updated: EventFeedbackFormConfig) => void;
}

const QUESTION_TYPE_BUTTONS: {
  type: QuestionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { type: "rating", label: "Star Rating", icon: Star },
  { type: "text", label: "Short Text", icon: Type },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft },
  { type: "single_choice", label: "Single Choice", icon: CircleDot },
  { type: "multiple_choice", label: "Checkboxes", icon: CheckSquare },
  { type: "nps", label: "NPS Score", icon: Zap },
  { type: "yes_no", label: "Yes / No", icon: ToggleLeft },
];

export default function EventFeedbackFormBuilder({ config, onChange }: Props) {
  const [showSettings, setShowSettings] = useState(false);
  const questions = config.questions || [];

  const updateConfig = (updates: Partial<EventFeedbackFormConfig>) => {
    onChange({ ...config, ...updates });
  };

  const handleAddQuestion = (type: QuestionType) => {
    const newId = `q_${Date.now()}`;
    let newQ: FormQuestion;

    switch (type) {
      case "rating":
        newQ = {
          id: newId,
          type: "rating",
          label: "How would you rate this experience?",
          required: true,
          maxRating: 5,
        };
        break;
      case "single_choice":
        newQ = {
          id: newId,
          type: "single_choice",
          label: "Which option best describes your experience?",
          required: false,
          options: ["Option 1", "Option 2", "Option 3"],
        };
        break;
      case "multiple_choice":
        newQ = {
          id: newId,
          type: "multiple_choice",
          label: "Select all that apply:",
          required: false,
          options: ["Option 1", "Option 2", "Option 3"],
        };
        break;
      case "text":
        newQ = {
          id: newId,
          type: "text",
          label: "What was your main takeaway?",
          required: false,
        };
        break;
      case "paragraph":
        newQ = {
          id: newId,
          type: "paragraph",
          label: "Any additional comments or suggestions?",
          required: false,
        };
        break;
      case "nps":
        newQ = {
          id: newId,
          type: "nps",
          label: "How likely are you to recommend our events to others?",
          required: false,
          scaleStartLabel: "Not likely",
          scaleEndLabel: "Extremely likely",
        };
        break;
      case "yes_no":
        newQ = {
          id: newId,
          type: "yes_no",
          label: "Would you attend future editions?",
          required: false,
        };
        break;
      default:
        newQ = {
          id: newId,
          type: "text",
          label: "Feedback question",
          required: false,
        };
    }

    updateConfig({ questions: [...questions, newQ] });
  };

  const handleDuplicateQuestion = (index: number) => {
    const target = questions[index];
    if (!target) return;
    const duplicated: FormQuestion = {
      ...target,
      id: `q_${Date.now()}`,
      label: `${target.label} (Copy)`,
      options: target.options ? [...target.options] : undefined,
    };
    const updated = [...questions];
    updated.splice(index + 1, 0, duplicated);
    updateConfig({ questions: updated });
  };

  const handleDeleteQuestion = (index: number) => {
    updateConfig({ questions: questions.filter((_, i) => i !== index) });
  };

  const handleMoveQuestion = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === questions.length - 1) return;
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const updated = [...questions];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateConfig({ questions: updated });
  };

  const handleUpdateQuestion = (index: number, fields: Partial<FormQuestion>) => {
    const updated = questions.map((q, i) => (i === index ? { ...q, ...fields } : q));
    updateConfig({ questions: updated });
  };

  const handleAddOption = (questionIndex: number) => {
    const q = questions[questionIndex];
    if (!q) return;
    const currentOptions = q.options || [];
    const newOptions = [...currentOptions, `Option ${currentOptions.length + 1}`];
    handleUpdateQuestion(questionIndex, { options: newOptions });
  };

  const handleUpdateOption = (questionIndex: number, optionIndex: number, val: string) => {
    const q = questions[questionIndex];
    if (!q || !q.options) return;
    const newOptions = [...q.options];
    newOptions[optionIndex] = val;
    handleUpdateQuestion(questionIndex, { options: newOptions });
  };

  const handleDeleteOption = (questionIndex: number, optionIndex: number) => {
    const q = questions[questionIndex];
    if (!q || !q.options || q.options.length <= 1) return;
    const newOptions = q.options.filter((_, i) => i !== optionIndex);
    handleUpdateQuestion(questionIndex, { options: newOptions });
  };

  const handleApplyTemplate = (templateKey: string) => {
    const tmpl = FORM_TEMPLATES[templateKey];
    if (!tmpl) return;
    if (
      questions.length > 0 &&
      !confirm(`Apply the "${tmpl.name}" template? This will replace current questions.`)
    ) {
      return;
    }
    updateConfig({ questions: tmpl.questions });
  };

  return (
    <div className="space-y-6">
      {/* ── 1. Quick Templates Bar ── */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand shrink-0" />
          <span className="text-xs font-bold text-neutral-800">Quick Templates:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.entries(FORM_TEMPLATES).map(([key, tmpl]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleApplyTemplate(key)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border border-neutral-200 transition-colors"
            >
              {tmpl.name.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Form Header Details (Title & Description) ── */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Form Title
          </label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            placeholder="e.g. Share Your Feedback"
            className="w-full text-lg sm:text-xl font-bold text-neutral-900 outline-none border-b border-neutral-200 focus:border-neutral-900 pb-2 transition-colors placeholder:text-neutral-300"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Welcome Note / Subtitle
          </label>
          <textarea
            rows={2}
            value={config.description}
            onChange={(e) => updateConfig({ description: e.target.value })}
            placeholder="Tell attendees why their feedback matters..."
            className="w-full text-xs text-neutral-600 outline-none border border-neutral-200 focus:border-neutral-900 p-3 rounded-xl transition-colors resize-none placeholder:text-neutral-300"
          />
        </div>
      </div>

      {/* ── 3. Questions List ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Questions ({questions.length})
          </h3>
          <span className="text-[11px] text-neutral-400">Drag or reorder questions below</span>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-neutral-100 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center mx-auto mb-3 text-neutral-400">
              <Plus className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800 mb-1">No questions yet</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
              Add your first question using the buttons below or click a template above.
            </p>
          </div>
        ) : (
          questions.map((q, idx) => {
            const isRating = q.type === "rating";
            const isChoice = q.type === "single_choice" || q.type === "multiple_choice";
            const isNps = q.type === "nps";
            const isYesNo = q.type === "yes_no";

            return (
              <div
                key={q.id || idx}
                className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-xs hover:border-neutral-200 transition-all space-y-3.5"
              >
                {/* Question Header & Order */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-neutral-50 border border-neutral-200 text-neutral-600">
                      {q.type === "rating" && "⭐ Star Rating"}
                      {q.type === "text" && "📝 Short Text"}
                      {q.type === "paragraph" && "📄 Long Answer"}
                      {q.type === "single_choice" && "🔘 Single Choice"}
                      {q.type === "multiple_choice" && "☑️ Multiple Choice"}
                      {q.type === "nps" && "🚀 NPS (0-10)"}
                      {q.type === "yes_no" && "👍 Yes/No"}
                      {!["rating", "text", "paragraph", "single_choice", "multiple_choice", "nps", "yes_no"].includes(q.type) && q.type}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveQuestion(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-20"
                      title="Move Up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveQuestion(idx, "down")}
                      disabled={idx === questions.length - 1}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 disabled:opacity-20"
                      title="Move Down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateQuestion(idx)}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1 rounded-md text-neutral-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <div>
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => handleUpdateQuestion(idx, { label: e.target.value })}
                    placeholder="Enter your question prompt..."
                    className="w-full text-sm font-semibold text-neutral-900 border border-neutral-200 focus:border-neutral-900 rounded-xl px-3.5 py-2 outline-none transition-colors"
                  />
                </div>

                {/* Subtitle / Helper (Optional) */}
                <div>
                  <input
                    type="text"
                    value={q.description || ""}
                    onChange={(e) => handleUpdateQuestion(idx, { description: e.target.value })}
                    placeholder="Optional helper note for attendees..."
                    className="w-full text-xs text-neutral-500 border border-neutral-100 focus:border-neutral-400 rounded-lg px-3 py-1.5 outline-none transition-colors"
                  />
                </div>

                {/* Options for Choice questions */}
                {isChoice && (
                  <div className="bg-neutral-50/70 p-3 rounded-xl border border-neutral-100 space-y-2">
                    <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wide">Options</span>
                    <div className="space-y-1.5">
                      {(q.options || []).map((opt, optIdx) => (
                        <div key={optIdx} className="flex items-center gap-2">
                          <span className="text-neutral-400 text-xs w-4 text-center">{optIdx + 1}.</span>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(idx, optIdx, e.target.value)}
                            className="flex-1 text-xs bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 outline-none focus:border-neutral-900"
                          />
                          {(q.options?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => handleDeleteOption(idx, optIdx)}
                              className="text-neutral-300 hover:text-red-500 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddOption(idx)}
                      className="text-xs font-bold text-brand hover:underline pt-1 inline-flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Option</span>
                    </button>
                  </div>
                )}

                {/* Bottom Card Controls (Required Switch) */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-600 font-medium">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) => handleUpdateQuestion(idx, { required: e.target.checked })}
                      className="rounded border-neutral-300 text-neutral-900 focus:ring-0"
                    />
                    <span>Required answer</span>
                  </label>

                  {isRating && <span className="text-[11px] text-neutral-400">1 to 5 Stars scale</span>}
                  {isNps && <span className="text-[11px] text-neutral-400">0 to 10 Recommendation scale</span>}
                  {isYesNo && <span className="text-[11px] text-neutral-400">Yes / No Thumbs</span>}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── 4. Add Question Toolbar (Simple Pill Buttons) ── */}
      <div className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-xs space-y-2">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          + Add New Question
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {QUESTION_TYPE_BUTTONS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleAddQuestion(item.type)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-neutral-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition-colors"
              >
                <Icon className="w-3.5 h-3.5 text-neutral-500" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 5. Form Options, Theme & Thank You Section ── */}
      <div className="bg-white rounded-3xl p-6 border border-neutral-100 shadow-xs space-y-4">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-neutral-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700">
              Form Settings &amp; Thank-You Note
            </h4>
          </div>
          <span className="text-xs font-bold text-brand hover:underline">
            {showSettings ? "Hide Settings" : "Customize"}
          </span>
        </button>

        {showSettings && (
          <div className="pt-3 border-t border-neutral-100 space-y-5">
            {/* Toggles */}
            <div className="space-y-3">
              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <div>
                  <span className="font-bold text-neutral-800">Allow Anonymous Responses</span>
                  <p className="text-[11px] text-neutral-400">Attendees can submit without providing their name</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.allow_anonymous}
                  onChange={(e) => updateConfig({ allow_anonymous: e.target.checked })}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                <div>
                  <span className="font-bold text-neutral-800">Require Attendee Email</span>
                  <p className="text-[11px] text-neutral-400">Collect verified emails from participants</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.require_attendee_email}
                  onChange={(e) => updateConfig({ require_attendee_email: e.target.checked })}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-0 w-4 h-4"
                />
              </label>
            </div>

            {/* Thank You Note */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                Post-Submission Thank-You Message
              </span>
              <input
                type="text"
                value={config.thank_you?.headline || "Thank you for your feedback!"}
                onChange={(e) =>
                  updateConfig({
                    thank_you: { ...config.thank_you, headline: e.target.value },
                  })
                }
                placeholder="Thank you headline..."
                className="w-full text-xs font-semibold text-neutral-800 border border-neutral-200 rounded-lg px-3 py-1.5 outline-none focus:border-neutral-900"
              />
              <textarea
                rows={2}
                value={config.thank_you?.message || "Your thoughts help us shape unforgettable future events."}
                onChange={(e) =>
                  updateConfig({
                    thank_you: { ...config.thank_you, message: e.target.value },
                  })
                }
                placeholder="Thank you message..."
                className="w-full text-xs text-neutral-600 border border-neutral-200 rounded-lg p-2.5 outline-none focus:border-neutral-900 resize-none"
              />
            </div>

            {/* Accent Theme Preset */}
            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                Form Accent Color
              </span>
              <div className="flex items-center gap-3">
                {Object.entries(FORM_THEME_PRESETS).map(([presetKey, presetVal]) => {
                  const isSelected = (config.theme?.themePreset || "violet") === presetKey;
                  return (
                    <button
                      key={presetKey}
                      type="button"
                      onClick={() =>
                        updateConfig({
                          theme: {
                            ...config.theme,
                            themePreset: presetKey as FormBrandingTheme["themePreset"],
                            primaryColor: presetVal.hex,
                          },
                        })
                      }
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? "ring-2 ring-neutral-900 ring-offset-2 scale-110" : "opacity-80 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: presetVal.hex }}
                      title={presetVal.name}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
