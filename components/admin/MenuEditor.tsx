"use client";
import { ArrowDown, ArrowUp, Ban, Check, Pencil, Plus, Trash2 } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/lib/content/schema";
import {
  addCategoryAction,
  deleteCategoryAction,
  deleteItemAction,
  moveCategoryAction,
  moveItemAction,
  saveItemAction,
  toggleItemAction,
  updateCategoryAction,
} from "@/app/admin/actions";
import { ActionButton, AdminForm, Checkbox, Field, Select, TextArea } from "./ui";

function ItemForm({ item, categoryId, categories }: { item?: MenuItem; categoryId: number; categories: MenuCategory[] }) {
  return (
    <AdminForm action={saveItemAction} submitLabel={item ? "Save dish" : "Add dish"} resetOnSuccess={!item} className="space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Dish name" name="name" required defaultValue={item?.name} maxLength={80} />
        <Field label="Name in Telugu" name="telugu" defaultValue={item?.telugu} maxLength={80} hint="Optional" lang="te" />
      </div>
      <TextArea label="Short description" name="description" rows={2} maxLength={300} defaultValue={item?.description} hint="One line about the dish. Optional." />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₹)" name="price" type="number" inputMode="numeric" min={0} step={1} defaultValue={item?.price ?? ""} hint="Leave empty to hide the price" />
        <Select label="Type" name="veg" defaultValue={item ? (item.veg ? "veg" : "nonveg") : "veg"}>
          <option value="veg">Vegetarian</option>
          <option value="nonveg">Non-vegetarian</option>
        </Select>
        <Select label="Spice level" name="spice" defaultValue={String(item?.spice ?? 0)}>
          <option value="0">Not spicy</option>
          <option value="1">Mild 🌶</option>
          <option value="2">Medium 🌶🌶</option>
          <option value="3">Hot 🌶🌶🌶</option>
        </Select>
      </div>
      <Select label="Menu section" name="categoryId" defaultValue={String(item?.categoryId ?? categoryId)}>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.title}</option>
        ))}
      </Select>
      <div className="flex flex-wrap gap-6">
        <Checkbox label="Guest favourite" name="signature" defaultChecked={item?.signature} hint="Shows a badge and adds it to the scrolling ribbon" />
        <Checkbox label="Available today" name="available" defaultChecked={item?.available ?? true} hint="Untick to hide it while sold out" />
      </div>
    </AdminForm>
  );
}

function MoveButtons({ action, id, name, isFirst, isLast }: { action: (fd: FormData) => Promise<void>; id: number; name: string; isFirst: boolean; isLast: boolean }) {
  return (
    <>
      {!isFirst && (
        <ActionButton action={action} fields={{ id, dir: "up" }} srLabel={`Move ${name} up`}>
          <ArrowUp aria-hidden="true" className="size-4" />
        </ActionButton>
      )}
      {!isLast && (
        <ActionButton action={action} fields={{ id, dir: "down" }} srLabel={`Move ${name} down`}>
          <ArrowDown aria-hidden="true" className="size-4" />
        </ActionButton>
      )}
    </>
  );
}

const disclosure = "cursor-pointer list-none rounded-lg border border-field px-3 py-1.5 text-sm text-cream hover:border-gold [&::-webkit-details-marker]:hidden";

export function MenuEditor({ menu }: { menu: MenuCategory[] }) {
  return (
    <div className="space-y-6">
      {menu.length === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-muted">No menu sections yet. Add one below.</p>}

      {menu.map((cat, ci) => (
        <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="rounded-2xl border border-line bg-surface">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
            <div className="flex items-center gap-3">
              <h2 id={`cat-${cat.id}`} className="font-display text-2xl text-cream">{cat.title}</h2>
              {!cat.visible && <span className="rounded-full bg-danger/15 px-2.5 py-0.5 text-xs font-bold text-danger">Hidden</span>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <MoveButtons action={moveCategoryAction} id={cat.id} name={`section ${cat.title}`} isFirst={ci === 0} isLast={ci === menu.length - 1} />
              <ActionButton
                action={deleteCategoryAction}
                fields={{ id: cat.id }}
                tone="danger"
                srLabel={`Delete section ${cat.title}`}
                confirmText={`Delete the "${cat.title}" section and all ${cat.items.length} dishes in it? This can't be undone.`}
              >
                <Trash2 aria-hidden="true" className="size-4" />
              </ActionButton>
            </div>
          </div>

          <details className="group border-b border-line px-5 py-3">
            <summary className={`${disclosure} inline-flex items-center gap-1.5`}>
              <Pencil aria-hidden="true" className="size-4" /> Rename or hide section
            </summary>
            <div className="mt-4">
              <AdminForm action={updateCategoryAction} submitLabel="Save section" className="space-y-4">
                <input type="hidden" name="id" value={cat.id} />
                <Field label="Section name" name="title" required defaultValue={cat.title} maxLength={60} />
                <Checkbox label="Show this section on the website" name="visible" defaultChecked={cat.visible} />
              </AdminForm>
            </div>
          </details>

          <ul className="divide-y divide-line">
            {cat.items.map((item, ii) => (
              <li key={item.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      role="img"
                      aria-label={item.veg ? "Vegetarian" : "Non-vegetarian"}
                      className={`grid size-4 shrink-0 place-items-center rounded-sm border-2 ${item.veg ? "border-leaf" : "border-ember"}`}
                    >
                      <span className={`size-1.5 rounded-full ${item.veg ? "bg-leaf" : "bg-ember"}`} />
                    </span>
                    <span className={`font-semibold ${item.available ? "text-cream" : "text-muted line-through"}`}>{item.name}</span>
                    {item.price !== null && <span className="text-gold">₹{item.price}</span>}
                    {!item.available && <span className="rounded-full bg-danger/15 px-2 py-0.5 text-xs font-bold text-danger">Sold out</span>}
                    {item.signature && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-xs font-bold text-gold">Favourite</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <ActionButton
                      action={toggleItemAction}
                      fields={{ id: item.id }}
                      label={item.available ? "Sold out" : "Available"}
                      srLabel={item.available ? `Mark ${item.name} sold out` : `Mark ${item.name} available`}
                    >
                      {item.available ? <Ban aria-hidden="true" className="size-4" /> : <Check aria-hidden="true" className="size-4" />}
                    </ActionButton>
                    <MoveButtons action={moveItemAction} id={item.id} name={item.name} isFirst={ii === 0} isLast={ii === cat.items.length - 1} />
                    <ActionButton
                      action={deleteItemAction}
                      fields={{ id: item.id }}
                      tone="danger"
                      srLabel={`Delete ${item.name}`}
                      confirmText={`Delete "${item.name}" from the menu?`}
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </ActionButton>
                  </div>
                </div>
                <details className="mt-3">
                  <summary className={`${disclosure} inline-flex items-center gap-1.5`}>
                    <Pencil aria-hidden="true" className="size-4" /> Edit<span className="sr-only"> {item.name}</span>
                  </summary>
                  <div className="mt-4 rounded-xl bg-surface-2/50 p-4">
                    <ItemForm item={item} categoryId={cat.id} categories={menu} />
                  </div>
                </details>
              </li>
            ))}
            {cat.items.length === 0 && <li className="px-5 py-4 text-muted">No dishes in this section yet.</li>}
          </ul>

          <details className="border-t border-line px-5 py-4">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-sm font-bold text-gold-deep [&::-webkit-details-marker]:hidden">
              <Plus aria-hidden="true" className="size-4" /> Add a dish<span className="sr-only"> to {cat.title}</span>
            </summary>
            <div className="mt-4">
              <ItemForm categoryId={cat.id} categories={menu} />
            </div>
          </details>
        </section>
      ))}

      <section aria-labelledby="new-section" className="rounded-2xl border border-dashed border-field p-5">
        <h2 id="new-section" className="text-lg font-bold text-cream">Add a menu section</h2>
        <p className="mt-1 text-sm text-muted">For example &ldquo;Starters&rdquo;, &ldquo;Biryanis&rdquo; or &ldquo;Desserts&rdquo;.</p>
        <div className="mt-4">
          <AdminForm action={addCategoryAction} submitLabel="Add section" resetOnSuccess>
            <Field label="Section name" name="title" required maxLength={60} />
          </AdminForm>
        </div>
      </section>
    </div>
  );
}
