"use client";

import React from "react";
import {
  DYNAMIC_FIELD_DEFINITIONS,
  type DynamicFieldDefinition,
} from "@/lib/studio/types";
import { User, Ticket, Calendar, Plus } from "lucide-react";

interface Props {
  onAddField: (field: DynamicFieldDefinition) => void;
}

export default function DynamicFields({ onAddField }: Props) {
  const attendeeFields = DYNAMIC_FIELD_DEFINITIONS.filter(
    (f) => f.category === "attendee"
  );
  const ticketFields = DYNAMIC_FIELD_DEFINITIONS.filter(
    (f) => f.category === "ticket"
  );
  const eventFields = DYNAMIC_FIELD_DEFINITIONS.filter(
    (f) => f.category === "event"
  );

  function renderGroup(
    title: string,
    icon: React.ElementType,
    fields: DynamicFieldDefinition[]
  ) {
    const Icon = icon;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500">
          <Icon className="w-3.5 h-3.5" />
          <span>{title}</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {fields.map((field) => (
            <button
              key={field.key}
              type="button"
              onClick={() => onAddField(field)}
              className="group flex items-center justify-between p-2.5 rounded-xl border border-neutral-200 bg-white hover:border-brand hover:bg-brand/5 text-left transition-all shadow-2xs"
            >
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 group-hover:text-brand">
                    {field.label}
                  </span>
                  <span className="text-[10px] font-mono text-neutral-400">
                    {`{{${field.key}}}`}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                  Sample: <strong className="font-semibold text-neutral-700">{field.sampleValue}</strong>
                </p>
              </div>

              <div className="w-6 h-6 rounded-lg bg-neutral-100 group-hover:bg-brand group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="p-3 bg-brand/5 border border-brand/20 rounded-xl">
        <p className="text-xs text-brand font-medium leading-relaxed">
          <strong>Dynamic Tokens:</strong> When an attendee receives their ticket, URPASS will automatically inject their real name, ticket tier, and gate credentials.
        </p>
      </div>

      {renderGroup("Attendee Information", User, attendeeFields)}
      {renderGroup("Ticket & Gate Access", Ticket, ticketFields)}
      {renderGroup("Event & Venue Details", Calendar, eventFields)}
    </div>
  );
}
