"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconSearch,
  IconPlus,
  IconMinus,
  IconShoppingBag,
  IconChevronRight,
} from "@tabler/icons-react";

function formatIDR(value) {
