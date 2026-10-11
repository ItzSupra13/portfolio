import { TargetProject, LearningResource } from '../types/journal';

export const INITIAL_TARGET_PROJECTS: TargetProject[] = [
  {
    id: 'proj-gemm-ladder',
    order: 1,
    title: 'GEMM Worklog: cuBLAS Parity Ladder (80–90% Target)',
    description: 'Progression from naive global memory matmul → coalescing → shared memory tiling → register blocking (float4 vectorized loads) → warp tiling → WMMA Tensor Cores. Document % of cuBLAS achieved at each milestone on a single GPU.',
    status: 'in-progress',
    targetTimeline: 'Weeks 1–5 & 11–14 (Phases 1 & 3)',
    techStack: ['CUDA C++20', 'Shared Memory', 'WMMA Tensor Cores', 'Nsight Compute', 'cuBLAS'],
    notes: 'Definition of done: tiled shared-memory kernel within 2–3x cuBLAS in Phase 1, pushed to >80% cuBLAS parity in Phase 3 with written breakdown of memory coalescing, bank conflict elimination, and register pressure.',
    repoUrl: 'https://github.com/username/cuda-gemm-worklog'
  },
  {
    id: 'proj-transpose-bank-conflicts',
    order: 2,
    title: 'Matrix Transpose Optimization & Bank Conflict Elimination',
    description: 'Reimplement NVIDIA/cuda-samples matrix transpose optimizations (naive → coalesced → bank-conflict-free via +1 shared memory padding). Measure and reproduce bandwidth saturation curves on rented GPUs.',
    status: 'in-progress',
    targetTimeline: 'Weeks 3–5 (Phase 1)',
    techStack: ['CUDA C++', 'Shared Memory Banks', 'Memory Coalescing', 'Nsight Systems'],
    notes: 'Eliminate all 32-way bank conflicts during column store phase by padding `__shared__ float tile[TILE_DIM][TILE_DIM + 1]`. Achieves near peak HBM bandwidth.',
    repoUrl: 'https://github.com/username/cuda-transpose-benchmark'
  },
  {
    id: 'proj-triton-fused',
    order: 3,
    title: 'Fused LayerNorm & Softmax Kernel in Triton vs PyTorch',
    description: 'Write custom fused Triton kernels for LayerNorm and Softmax. Benchmark execution latency and HBM roundtrips against native torch.compile / PyTorch across powers-of-two batch and hidden dimensions.',
    status: 'wishlist',
    targetTimeline: 'Weeks 6–10 (Phase 2)',
    techStack: ['OpenAI Triton', 'Python', 'PyTorch Autograd Extension', 'Nsight Compute Roofline'],
    notes: 'Determine exact crossover point where fused SRAM retention beats PyTorch kernel launch overhead. Verify gradient computation in backwards pass.',
    repoUrl: ''
  },
  {
    id: 'proj-flashattention-scratch',
    order: 4,
    title: 'FlashAttention from Scratch (Forward + Backward) & FA1→FA4 Study',
    description: 'Implement FlashAttention-1 forward pass in Triton using online softmax rescaling. Profile against standard attention in Nsight Compute, calculate theoretical vs achieved arithmetic intensity, and write the architectural delta breakdown for FA2, FA3 (Hopper TMA/WGMMA), and FA4.',
    status: 'wishlist',
    targetTimeline: 'Weeks 8–10 & 14–17 (Phases 2 & 3)',
    techStack: ['Triton', 'CUDA C++', 'Online Softmax', 'Nsight Compute Roofline', 'SRAM Tiling'],
    notes: 'Key insight: Keep intermediates in fast SRAM, reducing slow HBM memory access from O(N^2) to O(N). Avoid materializing the full N×N attention matrix.',
    repoUrl: ''
  },
  {
    id: 'proj-cutlass-cute',
    order: 5,
    title: 'CUTLASS CuTe Layout Algebra Extension & DeepGEMM Analysis',
    description: 'Work through NVIDIA CUTLASS 3.x examples, manipulate CuTe Layout algebra (Shape, Stride, Coshape), modify tile sizes and epilogue operations. Dissect DeepSeek\'s DeepGEMM (~300 lines) and analyze why smart TMA scheduling beats large monolithic libraries.',
    status: 'wishlist',
    targetTimeline: 'Weeks 14–17 (Phase 3)',
    techStack: ['CUTLASS 3.x', 'CuTe DSL', 'C++ Templates', 'DeepSeek DeepGEMM', 'Hopper TMA'],
    notes: 'Modify a CUTLASS GEMM example tile layout and write a technical breakdown of DeepGEMM\'s unrolled scheduling advantages.',
    repoUrl: ''
  },
  {
    id: 'proj-fsdp-scaling',
    order: 6,
    title: 'Multi-GPU Distributed Fine-Tuning & Open-Source Infra PR',
    description: 'Fine-tune a 1–3B parameter LLM across multiple GPUs using PyTorch FSDP (ZeRO-3 equivalent). Profile NCCL all-reduce and reduce-scatter collective communication overhead; plot throughput scaling (1→2→4 GPUs). Open and merge a contribution PR into Megatron-LM or DeepSpeed.',
    status: 'wishlist',
    targetTimeline: 'Weeks 18–23 (Phase 4)',
    techStack: ['PyTorch FSDP', 'NCCL', 'DeepSpeed ZeRO', 'Megatron-LM', 'Multi-GPU Profiling'],
    notes: 'Diagnose non-linear scaling gap (comm/comp overlap latency). Identify an open issue or documentation ambiguity in upstream training repos and submit fix.',
    repoUrl: ''
  },
  {
    id: 'proj-vllm-serving-kernel',
    order: 7,
    title: 'Custom Quantization Kernel Shipped into vLLM Serving Engine',
    description: 'Deploy vLLM/SGLang serving a 7B model on cloud GPUs. Benchmark TTFT (p50/p95), TPOT, and throughput under concurrent request loads. Write a custom Triton/CUDA kernel (e.g. FP8/INT4 fused dequant-GEMM or FlashMLA decode attention) and ship it into the serving pipeline, documenting end-to-end latency delta.',
    status: 'wishlist',
    targetTimeline: 'Weeks 24–30 (Phase 5)',
    techStack: ['vLLM Internals', 'PagedAttention', 'KV Cache Block Manager', 'SGLang', 'Triton Kernel'],
    notes: 'The flagship proof-of-work: bridges raw kernel authoring with production inference serving infrastructure.',
    repoUrl: ''
  }
];

export const INITIAL_LEARNING_RESOURCES: LearningResource[] = [
  {
    id: 'res-pmpp',
    title: 'Programming Massively Parallel Processors (4th Edition)',
    url: 'https://www.elsevier.com/books/programming-massively-parallel-processors/kirk/978-0-323-91894-7',
    category: 'book',
    authorOrSource: 'David Kirk & Wen-mei Hwu',
    notes: 'The canonical textbook for CUDA fundamentals: hardware execution model, thread warps, memory coalescing, and shared memory tiling.',
    tags: ['CUDA', 'Textbook', 'Phase 1', 'Hardware Architecture'],
    dateAdded: '2026-03-01',
    isFavorite: true
  },
  {
    id: 'res-cuda-by-example',
    title: 'CUDA by Example: An Introduction to General-Purpose GPU Programming',
    url: 'https://developer.nvidia.com/cuda-example',
    category: 'book',
    authorOrSource: 'Jason Sanders & Edward Kandrot',
    notes: 'Accessible hands-on on-ramp if PMPP chapters 1–2 feel dense. Covers grid launch configurations and parallel patterns.',
    tags: ['CUDA', 'Beginner', 'Phase 1'],
    dateAdded: '2026-03-01',
    isFavorite: false
  },
  {
    id: 'res-cuda-c-guide',
    title: 'NVIDIA CUDA C++ Programming Guide',
    url: 'https://docs.nvidia.com/cuda/cuda-c-programming-guide/',
    category: 'docs',
    authorOrSource: 'NVIDIA Official Documentation',
    notes: 'Primary engineering reference while writing code: warp shuffle primitives, atomic operations, synchronization barriers, and memory order.',
    tags: ['Official Docs', 'CUDA Reference', 'Phase 1'],
    dateAdded: '2026-03-02',
    isFavorite: true
  },
  {
    id: 'res-cuda-samples',
    title: 'NVIDIA CUDA Code Samples Repository',
    url: 'https://github.com/NVIDIA/cuda-samples',
    category: 'repo',
    authorOrSource: 'NVIDIA',
    notes: 'Study `matrixMul`, `reduction`, and `transpose` samples line-by-line to understand production optimization steps.',
    tags: ['cuda-samples', 'Reference Code', 'Phase 1'],
    dateAdded: '2026-03-02',
    isFavorite: true
  },
  {
    id: 'res-llm-c',
    title: 'karpathy/llm.c — LLM Training in Simple, Raw C/CUDA',
    url: 'https://github.com/karpathy/llm.c',
    category: 'repo',
    authorOrSource: 'Andrej Karpathy',
    notes: 'Raw CUDA kernels for GPT-2 training with zero framework bloat. Study the standalone kernel implementations in `dev/cuda`.',
    tags: ['llm.c', 'Karpathy', 'GPT-2', 'Clean Kernels'],
    dateAdded: '2026-03-03',
    isFavorite: true
  },
  {
    id: 'res-gpu-mode',
    title: 'GPU MODE (CUDA MODE) Lecture Series & Community Walkthroughs',
    url: 'https://github.com/gpu-mode/lectures',
    category: 'video',
    authorOrSource: 'GPU MODE Community (YouTube)',
    notes: 'Practitioner-level kernel walkthroughs covering Triton, PTX, CUTLASS, FP8, and modern LLM serving optimizations.',
    tags: ['GPU MODE', 'YouTube', 'Practitioner Community'],
    dateAdded: '2026-03-03',
    isFavorite: true
  },
  {
    id: 'res-leetgpu',
    title: 'LeetGPU GPU Kernel Coding Challenges',
    url: 'https://leetgpu.com/challenges',
    category: 'practice',
    authorOrSource: 'LeetGPU',
    notes: 'Interactive online CUDA kernel challenge platform with instant execution and speed grading against baselines.',
    tags: ['LeetGPU', 'Practice', 'Problem Solving'],
    dateAdded: '2026-03-04',
    isFavorite: true
  },
  {
    id: 'res-gpu-puzzles',
    title: 'Sasha Rush GPU Puzzles (Numba / CUDA)',
    url: 'https://github.com/srush/GPU-Puzzles',
    category: 'practice',
    authorOrSource: 'Sasha Rush (Cornell / Hugging Face)',
    notes: 'Interactive puzzle notebooks teaching thread indexing, guard conditions, shared memory, and warp voting.',
    tags: ['Puzzles', 'Interactive', 'Indexing'],
    dateAdded: '2026-03-04',
    isFavorite: false
  },
  {
    id: 'res-horace-brrr',
    title: 'Making Deep Learning Go Brrr From First Principles',
    url: 'https://horace.io/brrr_intro.html',
    category: 'blog',
    authorOrSource: 'Horace He (Meta PyTorch)',
    notes: 'The single best intuitive guide on compute-bound vs memory-bound vs overhead-bound bottlenecks and roofline math.',
    tags: ['Roofline', 'Horace He', 'Core Reading', 'Phase 2'],
    dateAdded: '2026-03-05',
    isFavorite: true
  },
  {
    id: 'res-nsight-compute',
    title: 'NVIDIA Nsight Compute Profiling Documentation',
    url: 'https://docs.nvidia.com/nsight-compute/',
    category: 'docs',
    authorOrSource: 'NVIDIA',
    notes: 'Learn to read Speed-of-Light (SOL) throughput bars, memory chart hierarchy, and the Compute vs Memory Roofline chart.',
    tags: ['Nsight Compute', 'Profiling', 'Phase 2'],
    dateAdded: '2026-03-05',
    isFavorite: true
  },
  {
    id: 'res-triton-tutorials',
    title: 'OpenAI Triton Official Tutorials & Documentation',
    url: 'https://triton-lang.org/main/getting-started/tutorials/index.html',
    category: 'docs',
    authorOrSource: 'Triton Authors (Philippe Tillet et al.)',
    notes: 'Do every tutorial: Vector Add → Fused Softmax → Block Matmul → Fused Low-Memory Attention.',
    tags: ['Triton', 'OpenAI', 'Python Kernels', 'Phase 2'],
    dateAdded: '2026-03-06',
    isFavorite: true
  },
  {
    id: 'res-umar-jamil-fa',
    title: 'Coding FlashAttention from Scratch (YouTube Deep Dive)',
    url: 'https://www.youtube.com/watch?v=F3Gzz_c1Oow',
    category: 'video',
    authorOrSource: 'Umar Jamil',
    notes: 'Step-by-step mathematical bridging from standard attention to online softmax tiling and IO-aware SRAM management.',
    tags: ['FlashAttention', 'Umar Jamil', 'SRAM Tiling'],
    dateAdded: '2026-03-06',
    isFavorite: true
  },
  {
    id: 'res-flashattention-repo',
    title: 'Dao-AILab/flash-attention (FA1, FA2, and FA3 Hopper)',
    url: 'https://github.com/Dao-AILab/flash-attention',
    category: 'repo',
    authorOrSource: 'Tri Dao et al. (Stanford / Princeton)',
    notes: 'Study `flash_attn_triton.py` first, then inspect C++/CUTLASS implementations for FA2 and FA3 async Hopper TMA pipelines.',
    tags: ['FlashAttention', 'Tri Dao', 'Phase 3 Frontier'],
    dateAdded: '2026-03-07',
    isFavorite: true
  },
  {
    id: 'res-cutlass-cute',
    title: 'NVIDIA CUTLASS & CuTe Layout Algebra Documentation',
    url: 'https://github.com/NVIDIA/cutlass/tree/main/media/docs/cpp/cute',
    category: 'docs',
    authorOrSource: 'NVIDIA CUTLASS Team',
    notes: 'Master layout algebra: Shape, Stride, Hierarchical Layouts, and Copy/Gemm tensor partitioners for modern Tensor Cores.',
    tags: ['CUTLASS', 'CuTe', 'Layout Algebra', 'Phase 3'],
    dateAdded: '2026-03-08',
    isFavorite: true
  },
  {
    id: 'res-deepgemm-flashmla',
    title: 'DeepSeek-AI DeepGEMM & FlashMLA Repositories',
    url: 'https://github.com/deepseek-ai/DeepGEMM',
    category: 'repo',
    authorOrSource: 'DeepSeek-AI',
    notes: 'DeepGEMM is ~300 lines of clean, readable code beating larger baselines via smart scheduling and Hopper TMA integration.',
    tags: ['DeepSeek', 'DeepGEMM', 'FlashMLA', 'Hopper'],
    dateAdded: '2026-03-08',
    isFavorite: true
  },
  {
    id: 'res-kernelbench',
    title: 'ScalingIntelligence/KernelBench Evaluation Suite',
    url: 'https://github.com/ScalingIntelligence/KernelBench',
    category: 'repo',
    authorOrSource: 'Scaling Intelligence',
    notes: 'Standard benchmark testing LLM-generated GPU kernel correctness and speedup against PyTorch baseline across 100+ tasks.',
    tags: ['KernelBench', 'AI Kernels', 'Benchmarking'],
    dateAdded: '2026-03-09',
    isFavorite: false
  },
  {
    id: 'res-ultrascale-playbook',
    title: 'Hugging Face: The Ultra-Scale Playbook for Multi-GPU Training',
    url: 'https://huggingface.co/spaces/nanotron/ultrascale-playbook',
    category: 'docs',
    authorOrSource: 'Hugging Face (Nanotron Team)',
    notes: 'The definitive hands-on guide on scaling 3D parallelism: Data Parallelism (DP/FSDP), Tensor Parallelism (TP), and Pipeline Parallelism (PP).',
    tags: ['FSDP', 'Megatron', 'Distributed Training', 'Phase 4'],
    dateAdded: '2026-03-10',
    isFavorite: true
  },
  {
    id: 'res-stas-ml-eng',
    title: 'ML Engineering Book: Debugging OOMs, NCCL Hangs & Stragglers',
    url: 'https://github.com/stas00/ml-engineering',
    category: 'book',
    authorOrSource: 'Stas Bekman (ex-Hugging Face BigScience)',
    notes: 'Extremely practical field manual on multi-GPU failure modes, NCCL timeout triage, and hardware health checking.',
    tags: ['Troubleshooting', 'NCCL', 'Multi-GPU', 'Phase 4'],
    dateAdded: '2026-03-10',
    isFavorite: true
  },
  {
    id: 'res-pagedattention-paper',
    title: 'Efficient Memory Management for LLM Serving with PagedAttention',
    url: 'https://arxiv.org/abs/2309.06180',
    category: 'paper',
    authorOrSource: 'Woosuk Kwon et al. (UC Berkeley / vLLM)',
    notes: 'Foundational paper introducing virtual memory paging to KV cache management, eliminating memory fragmentation in serving.',
    tags: ['vLLM', 'PagedAttention', 'Paper', 'Phase 5'],
    dateAdded: '2026-03-11',
    isFavorite: true
  },
  {
    id: 'res-vllm-repo',
    title: 'vLLM: High-Throughput and Memory-Efficient LLM Serving Engine',
    url: 'https://github.com/vllm-project/vllm',
    category: 'repo',
    authorOrSource: 'vLLM Project Authors',
    notes: 'Study `block_manager.py` and the continuous batching scheduler to master source-level inference engineering.',
    tags: ['vLLM', 'Source Reading', 'Inference Engine', 'Phase 5'],
    dateAdded: '2026-03-11',
    isFavorite: true
  },
  {
    id: 'res-sglang-repo',
    title: 'SGLang: Fast Serving Framework with RadixAttention',
    url: 'https://github.com/sgl-project/sglang',
    category: 'repo',
    authorOrSource: 'Lianmin Zheng et al.',
    notes: 'Examine RadixAttention prefix caching trees and comparative benchmark advantages over standard continuous batching.',
    tags: ['SGLang', 'RadixAttention', 'Prefix Caching', 'Phase 5'],
    dateAdded: '2026-03-12',
    isFavorite: true
  }
];
