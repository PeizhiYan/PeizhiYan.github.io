/* ════════════════════════════════
   MINIMAX SEARCH WITH ALPHA-BETA PRUNING

   Two AI modes, selectable via the UI's "Search depth" control:

   - "No tree search" (depth 0): the original single-ply heuristic --
     score every empty cell on the whole board once, no recursion, no
     candidate-set restriction. See chooseAiMoveNoSearch().
   - Tree search (depth 2 or 4 -- always EVEN): a real minimax search
     with alpha-beta pruning. Even depths always end on the simulated
     opponent's best reply before scoring, so every AI move under
     consideration -- including the deepest one -- gets tested against
     "what's their best response to this" before it's trusted. (Odd
     depths would end on the AI's own move unchecked; that's why this
     mode only offers even depths.)

   The tree-search leaf evaluation is boardValue(board_ai) -
   boardValue(board) -- the same "Net" figure already shown in the AI
   Insight panel -- so deeper search is literally look-ahead on the number
   already visible on screen.

   Requires game_logic.js to be loaded first (boardValue, evaluate, hasFive,
   count, conv2d, filter1a..filter4d).
════════════════════════════════ */

var SEARCH_RADIUS       = 2        // only empty cells within this many cells
                                    // (Chebyshev distance) of a stone are considered
                                    // for tree search (not for "no tree search" mode,
                                    // which scans every empty cell)
var CANDIDATES_PER_NODE = 10       // branching-factor cap at every tree-search node
var WIN_SCORE            = 10000000 // comfortably dominates any non-terminal boardValue()

/* All empty cells -- used by "no tree search" mode, which (like the
   original heuristic AI) considers the whole board, not just cells near
   existing stones. */
function allEmptyCells(b){
	var out = []
	for (var i = 0; i < 15; i++)
		for (var j = 0; j < 15; j++)
			if (b[i][j] === 0) out.push([i, j])
	return out
}

/* Empty cells worth considering FOR TREE SEARCH: neighbors of existing
   stones. On an empty board (game start) there are no stones to anchor
   around, so just offer the center cell. (Restricting to a neighborhood
   is what keeps deeper search tractable -- "no tree search" mode doesn't
   need this since it never recurses.) */
function generateCandidates(b){
	var seen = {}
	var out  = []
	var any  = false
	for (var i = 0; i < 15; i++){
		for (var j = 0; j < 15; j++){
			if (b[i][j] === 0) continue
			any = true
			for (var di = -SEARCH_RADIUS; di <= SEARCH_RADIUS; di++){
				for (var dj = -SEARCH_RADIUS; dj <= SEARCH_RADIUS; dj++){
					var ni = i + di, nj = j + dj
					if (ni < 0 || ni >= 15 || nj < 0 || nj >= 15) continue
					if (b[ni][nj] !== 0) continue
					var key = ni * 15 + nj
					if (seen[key]) continue
					seen[key] = true
					out.push([ni, nj])
				}
			}
		}
	}
	if (!any) return [[7, 7]]
	return out
}

/* Small center-of-board tiebreaker (same shape as computeValue()'s bias in
   game_logic.js). evaluate() alone often ties -- e.g. any two candidates
   that don't yet touch a 2-in-a-row both score exactly 0 -- and without
   this, ties silently fall back to scan order, which systematically
   favors the top-left-most candidate (generateCandidates()'s di/dj loop
   enumerates neighbors top-left-first). That produced a real, reproduced
   bug: the AI clustering toward the top-left corner regardless of the
   actual position. This term is small enough (max ~2) to never override
   a genuine pattern-score difference (the smallest real increment is 3,
   from a half-open two), only to break ties toward the center. */
function centerBias(i, j){
	var di = 7.5 - i, dj = 7.5 - j
	return 2 / (di*di + dj*dj)
}

/* Score candidates by a cheap one-move heuristic and sort best-first.
   Returns {c, s} objects (cell + score), highest score first -- callers
   cap to the top few themselves when they need branching bounded (tree
   search) but not when they don't (no-tree-search mode wants the true
   argmax over every cell).

   Scores BOTH how good the move is for the mover (offense) AND how good
   it would be for the opponent if they got to play there instead (i.e.
   how much this move denies them -- defense), exactly like the original
   heuristic AI's computeValue() did (offense+defense per cell). Using
   only offense here was a real bug: a cell that's critical to block
   (e.g. the open end of the opponent's three) can score low under pure
   offense and get pruned out of the top candidates before a deeper
   search ever gets a chance to search it. */
function scoreCandidates(candidates, moverOwnBoard, opponentBoard){
	var scored = candidates.map(function (c) {
		var offense = evaluate(moverOwnBoard, c[0], c[1])
		var defense = evaluate(opponentBoard, c[0], c[1])
		return { c: c, s: offense + defense + centerBias(c[0], c[1]) }
	})
	scored.sort(function (a, b) { return b.s - a.s })
	return scored
}

/* "No tree search": the original algorithm. Score every empty cell on
   the whole board once (offense+defense+centerBias, see scoreCandidates)
   and take the best -- no recursion, no candidate-set restriction. A
   winning move is picked automatically since boardValue()'s 99999
   five-in-a-row weight dominates every other score via evaluate(). */
function chooseAiMoveNoSearch(board, board_ai){
	var scored = scoreCandidates(allEmptyCells(board), board_ai, board)
	return scored.length ? scored[0].c : null
}

/* Recursive minimax with alpha-beta pruning. `board`/`board_ai` are
   mutated in place for each trial move and restored immediately after --
   no per-node board cloning. `aiTurn` is true when it's the AI's
   (maximizing) move to choose, false for the simulated human's
   (minimizing) reply. `depthLeft` is plies remaining including this one;
   it also breaks ties between same-outcome wins/losses in favor of
   faster wins and slower losses.

   Leaf evaluation (depthLeft <= 1) uses boardValue(board_ai) -
   boardValue(board), the whole-board net. This is only called with even
   total depths (2/4, see chooseAiMove), which always reach this leaf
   right after the simulated opponent's reply -- so the danger of e.g. an
   unblocked open three shows up for real, as the opponent's simulated
   extension into an open four, not as a guess. */
function minimaxSearch(board, board_ai, depthLeft, alpha, beta, aiTurn){
	var moverBoard    = aiTurn ? board_ai : board
	var opponentBoard = aiTurn ? board : board_ai
	var scored        = scoreCandidates(generateCandidates(board), moverBoard, opponentBoard).slice(0, CANDIDATES_PER_NODE)

	if (scored.length === 0) return { score: 0, move: null }

	var bestMove  = scored[0].c
	var bestScore = aiTurn ? -Infinity : Infinity

	for (var k = 0; k < scored.length; k++){
		var i = scored[k].c[0], j = scored[k].c[1]
		var mine = aiTurn ? -1 : 1
		board[i][j]    = mine
		board_ai[i][j] = -mine

		var score
		if (hasFive(aiTurn ? board_ai : board)){
			score = aiTurn ? (WIN_SCORE + depthLeft) : (-WIN_SCORE - depthLeft)
		} else if (depthLeft <= 1){
			score = boardValue(board_ai) - boardValue(board)
		} else {
			score = minimaxSearch(board, board_ai, depthLeft - 1, alpha, beta, !aiTurn).score
		}

		board[i][j]    = 0
		board_ai[i][j] = 0

		if (aiTurn){
			if (score > bestScore){ bestScore = score; bestMove = [i, j] }
			if (bestScore > alpha) alpha = bestScore
		} else {
			if (score < bestScore){ bestScore = score; bestMove = [i, j] }
			if (bestScore < beta) beta = bestScore
		}
		if (alpha >= beta) break /* prune: opponent already has a better option elsewhere */
	}

	return { score: bestScore, move: bestMove }
}

/* Entry point: pick the AI's move. depth === 0 means "no tree search"
   (the original algorithm); otherwise depth is clamped to the nearest
   valid even value in 2..4 and a real minimax search runs. Returns
   [i,j], or null if the board is full. (Depth 6 was offered briefly but
   removed -- worst-case ~30s+ per move was too slow in practice.) */
function chooseAiMove(board, board_ai, depth){
	if (!depth) return chooseAiMoveNoSearch(board, board_ai)
	depth = Math.max(2, Math.min(4, Math.round(depth / 2) * 2))
	return minimaxSearch(board, board_ai, depth, -Infinity, Infinity, true).move
}
