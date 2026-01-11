import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());



// 1. REGISTRAR USUARIO (POST)
app.post("/usuarios", async (req, res) => {
  try {
    const { cedula, nombre, clave } = req.body;

    if (!cedula || !nombre || !clave) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const query = `
      INSERT INTO usuarios (cedula, nombre, clave)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const result = await pool.query(query, [cedula, nombre, clave]);
    res.json({ msg: "Usuario registrado", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. CONSULTAR USUARIO POR ID (GET)
app.get("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [id]); 

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CONSULTAR TODOS LOS USUARIOS (GET)
app.get("/usuarios", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. EDITAR USUARIO POR ID (PUT)
app.put("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { cedula, nombre, clave } = req.body; 

    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (cedula !== undefined) {
      updates.push(`cedula = $${paramIndex++}`);
      values.push(cedula);
    }
    if (nombre !== undefined) {
      updates.push(`nombre = $${paramIndex++}`);
      values.push(nombre);
    }
    if (clave !== undefined) {
      updates.push(`clave = $${paramIndex++}`);
      values.push(clave);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ msg: });
    }

    values.push(id); 

    const query = `
      UPDATE usuarios
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado para actualizar" });
    }

    res.json({ msg: "Usuario actualizado correctamente", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 5. ELIMINAR USUARIO POR ID (DELETE)
app.delete("/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM usuarios WHERE id = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Usuario no encontrado para eliminar" });
    }

    res.json({ msg: "Usuario eliminado correctamente", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ===================================
//              RUTAS MATERIA
// ===================================

// 6.  REGISTRAR MATERIA (POST)
app.post("/materias", async (req, res) => {
  try {
    const { nombre_materia } = req.body;

    if (!nombre_materia) {
      return res.status(400).json({ msg: "El nombre de la materia es obligatorio" });
    }

    const query = `
      INSERT INTO materia (nombre_materia)
      VALUES ($1)
      RETURNING *;
    `;

    const result = await pool.query(query, [nombre_materia]);
    res.json({ msg: "Materia registrada", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 7.  CONSULTAR TODAS LAS MATERIAS (GET)
app.get("/materias", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM materia ORDER BY id_materia ASC");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 8.  CONSULTAR MATERIA POR ID (GET)
app.get("/materias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM materia WHERE id_materia = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Materia no encontrada" });
    }

    res.json(result.rows[0]);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 9.  EDITAR MATERIA POR ID (PUT)
app.put("/materias/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_materia } = req.body;

    if (!nombre_materia) {
      return res.status(400).json({ msg: "El nuevo nombre de la materia es obligatorio" });
    }

    const query = `
      UPDATE materia
      SET nombre_materia = $1
      WHERE id_materia = $2
      RETURNING *;
    `;

    const result = await pool.query(query, [nombre_materia, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Materia no encontrada para actualizar" });
    }

    res.json({ msg: "Materia actualizada correctamente", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 10.  ELIMINAR MATERIA POR ID (DELETE)
app.delete("/materias/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM materia WHERE id_materia = $1 RETURNING *";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Materia no encontrada para eliminar" });
    }

    res.json({ msg: "Materia eliminada correctamente", data: result.rows[0] });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
