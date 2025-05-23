
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, PlusCircle } from "lucide-react";

interface Milestone {
  date: string;
  description: string;
}

interface TimelineData {
  startDate: string;
  endDate: string;
  milestones?: Milestone[];
}

interface TimelineStepProps {
  value: TimelineData;
  onChange: (data: TimelineData) => void;
}

export function TimelineStep({ value, onChange }: TimelineStepProps) {
  const handleChange = (field: keyof TimelineData, fieldValue: any) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  const handleAddMilestone = () => {
    const currentMilestones = value.milestones || [];
    handleChange('milestones', [
      ...currentMilestones,
      { date: '', description: '' }
    ]);
  };

  const handleRemoveMilestone = (index: number) => {
    const currentMilestones = value.milestones || [];
    handleChange('milestones', 
      currentMilestones.filter((_, i) => i !== index)
    );
  };

  const updateMilestone = (index: number, field: keyof Milestone, fieldValue: string) => {
    const currentMilestones = value.milestones || [];
    const updatedMilestones = currentMilestones.map((milestone, i) => {
      if (i === index) {
        return { ...milestone, [field]: fieldValue };
      }
      return milestone;
    });
    handleChange('milestones', updatedMilestones);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Data de Início *</Label>
          <Input
            id="start-date"
            type="date"
            value={value.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end-date">Data de Término *</Label>
          <Input
            id="end-date"
            type="date"
            value={value.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <Label>Marcos/Etapas Intermediárias (opcional)</Label>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddMilestone}
            className="flex items-center"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar etapa
          </Button>
        </div>

        {(value.milestones || []).map((milestone, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 mb-3">
            <div className="col-span-4">
              <Input
                type="date"
                value={milestone.date}
                onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                placeholder="Data"
              />
            </div>
            <div className="col-span-7">
              <Input
                value={milestone.description}
                onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                placeholder="Descrição da etapa"
              />
            </div>
            <div className="col-span-1 flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleRemoveMilestone(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remover</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
