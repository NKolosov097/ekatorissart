export default function NewArtworkPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-3xl mb-2">New artwork</h1>
      <p className="text-sm text-muted mb-10">
        Fill the details below. Image upload will save to R2 and the row will be
        inserted into the database (wiring left as a TODO).
      </p>

      <form
        className="space-y-6"
        action="/api/admin/artworks"
        method="POST"
        encType="multipart/form-data"
      >
        <Field label="Title" name="title" required />
        <Field label="Year" name="year" type="number" required defaultValue={new Date().getFullYear().toString()} />

        <div className="grid grid-cols-2 gap-4">
          <Field label="Width (cm)" name="widthCm" type="number" step="0.1" required />
          <Field label="Height (cm)" name="heightCm" type="number" step="0.1" required />
        </div>

        <Select label="Medium" name="medium" options={["OIL", "ACRYLIC", "WATERCOLOR", "GOUACHE", "PASTEL", "MIXED"]} />
        <Field label="Surface" name="surface" defaultValue="Linen" required />
        <Field label="Price (USD)" name="price" type="number" step="1" min="0" required />
        <Select label="Status" name="status" options={["AVAILABLE", "SOLD"]} />
        <Select label="Type" name="kind" options={["ORIGINAL", "PRINT"]} />

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Description</label>
          <textarea name="description" rows={3} className="w-full border border-line bg-bone px-3 py-2 text-sm focus:outline-none focus:border-ink" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">
            Story (long-form, great for SEO)
          </label>
          <textarea name="story" rows={6} className="w-full border border-line bg-bone px-3 py-2 text-sm focus:outline-none focus:border-ink" />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-muted mb-2">Primary image</label>
          <input type="file" name="primaryImage" accept="image/*" />
        </div>

        <div className="flex items-center gap-3">
          <input id="framed" name="framed" type="checkbox" />
          <label htmlFor="framed" className="text-sm">Framed</label>
        </div>

        <div className="flex items-center gap-3">
          <input id="featured" name="featured" type="checkbox" />
          <label htmlFor="featured" className="text-sm">Featured on homepage</label>
        </div>

        <button type="submit" className="btn-primary mt-4">Save artwork</button>
      </form>
    </div>
  );
}

function Field({
  label, name, type = "text", required, defaultValue, step, min,
}: {
  label: string; name: string; type?: string; required?: boolean;
  defaultValue?: string; step?: string; min?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        step={step}
        min={min}
        className="w-full border border-line bg-bone px-3 py-2 text-sm focus:outline-none focus:border-ink"
      />
    </div>
  );
}

function Select({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</label>
      <select name={name} className="w-full border border-line bg-bone px-3 py-2 text-sm focus:outline-none focus:border-ink">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
