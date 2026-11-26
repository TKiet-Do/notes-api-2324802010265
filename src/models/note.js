const { Schema, model } = require('mongoose');

const noteSchema = new Schema(
  {
    owner: { type: String, required: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, default: '' },
    tags: { type: [String], default: [] },
    attachmentUrl: String,
  },
  { timestamps: true }
);

noteSchema.index({ tags: 1 });

module.exports = model('Note', noteSchema);