import { useState } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { TagInput } from '@/components/admin/TagInput';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'tags';
  placeholder?: string;
  required?: boolean;
}

interface JSONArrayEditorProps {
  value: any[];
  onChange: (value: any[]) => void;
  fields: Field[];
  label?: string;
  itemLabel?: string;
  maxItems?: number;
}

export const JSONArrayEditor = ({
  value = [],
  onChange,
  fields,
  label = 'Items',
  itemLabel = 'Item',
  maxItems,
}: JSONArrayEditorProps) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    new Set(value.length === 0 ? [] : [0])
  );

  const addItem = () => {
    if (maxItems && value.length >= maxItems) return;

    const newItem: any = {};
    fields.forEach((field) => {
      if (field.type === 'number') newItem[field.name] = 0;
      else if (field.type === 'tags') newItem[field.name] = [];
      else newItem[field.name] = '';
    });

    const newValue = [...value, newItem];
    onChange(newValue);
    setExpandedItems(new Set([...expandedItems, value.length]));
  };

  const removeItem = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(index);
    setExpandedItems(newExpanded);
  };

  const updateItem = (index: number, field: string, fieldValue: any) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], [field]: fieldValue };
    onChange(newValue);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }

    const newValue = [...value];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newValue[index], newValue[targetIndex]] = [newValue[targetIndex], newValue[index]];
    onChange(newValue);
  };

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <Button
          type="button"
          size="sm"
          onClick={addItem}
          disabled={maxItems !== undefined && value.length >= maxItems}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add {itemLabel}
        </Button>
      </div>

      {value.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No items added yet. Click "Add {itemLabel}" to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {value.map((item, index) => (
            <Card key={index}>
              <Collapsible
                open={expandedItems.has(index)}
                onOpenChange={() => toggleExpanded(index)}
              >
                <div className="flex items-center gap-2 p-3 border-b border-border">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex-1 justify-start">
                      {expandedItems.has(index) ? (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      ) : (
                        <ChevronRight className="w-4 h-4 mr-2" />
                      )}
                      <span className="font-medium">
                        {itemLabel} {index + 1}
                      </span>
                      {item[fields[0]?.name] && (
                        <span className="ml-2 text-muted-foreground truncate">
                          - {item[fields[0].name]}
                        </span>
                      )}
                    </Button>
                  </CollapsibleTrigger>

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === value.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                <CollapsibleContent>
                  <CardContent className="p-4 space-y-4">
                    {fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <Label>
                          {field.label}
                          {field.required && <span className="text-destructive ml-1">*</span>}
                        </Label>
                        {field.type === 'textarea' ? (
                          <Textarea
                            value={item[field.name] || ''}
                            onChange={(e) => updateItem(index, field.name, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        ) : field.type === 'tags' ? (
                          <TagInput
                            tags={Array.isArray(item[field.name]) ? item[field.name] : []}
                            onChange={(tags) => updateItem(index, field.name, tags)}
                            placeholder={field.placeholder ?? 'Paste image URL and press Enter'}
                          />
                        ) : (
                          <Input
                            type={field.type}
                            value={item[field.name] || ''}
                            onChange={(e) =>
                              updateItem(
                                index,
                                field.name,
                                field.type === 'number' ? Number(e.target.value) : e.target.value
                              )
                            }
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>
      )}

      {maxItems && (
        <p className="text-xs text-muted-foreground">
          {value.length} / {maxItems} items
        </p>
      )}
    </div>
  );
};

