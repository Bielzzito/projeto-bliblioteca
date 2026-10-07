import express from "express";
import { cadastrarLivro, listarlivros, atualizarLivro, buscarLivroPorID, deletarLivro } from "../controllers/livrocontrollers.js";

const router = express.Router();
router.get("/", listarlivros);
router.post("/", cadastrarLivro);
router.put("/:id", atualizarLivro);
router.delete("/:id", deletarLivro);
router.get("/:id", buscarLivroPorID);

export default router;