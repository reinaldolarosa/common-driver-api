const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    validate: {
      validator: function(v) {
        return v instanceof Date && !isNaN(v);
      },
      message: props => `${props.value} no es una fecha válida`
    }
  },
  time: {
    type: String,
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Campos explícitos para createdAt y updatedAt
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Desactiva timestamps automáticos si ya los definimos explícitamente
  timestamps: false
});

// Campo virtual para mostrar la fecha en formato dd/MM/yyyy
TripSchema.virtual('formattedDate').get(function() {
  const day = String(this.date.getDate()).padStart(2, '0');
  const month = String(this.date.getMonth() + 1).padStart(2, '0'); // Meses son 0-indexados
  const year = this.date.getFullYear();
  return `${day}/${month}/${year}`;
});

// Incluye campos virtuales y timestamps en las respuestas JSON
TripSchema.set('toJSON', { virtuals: true });
TripSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Trip', TripSchema);